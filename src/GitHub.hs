{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE DeriveAnyClass    #-}
{-# LANGUAGE DeriveGeneric     #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators     #-}
{-# LANGUAGE DuplicateRecordFields     #-}

module GitHub where

import           Control.Monad       (mzero)
import           Data.Aeson
import           Data.Proxy
import           Data.Text
import           GHC.Generics
import           Network.HTTP.Client (defaultManagerSettings, newManager)
import           Servant.API
import           Servant.Client

type Username  = Text
type UserAgent = Text
type Reponame  = Text

data GitHubRepo =
  GitHubRepo { name :: Text
             , owner :: Users
             , fullname :: Maybe Text
             , language :: Maybe Text
             } deriving (Generic, FromJSON, ToJSON, Show)

data RepoContributor =
  RepoContributor { login :: Text
                  , contributions :: Integer
                  } deriving (Generic, FromJSON, ToJSON, Show)

data Committer =
  Committer { date :: Text } deriving (Generic, FromJSON, ToJSON, Show)

data Commits =
  Commits { committer :: Committer } deriving (Generic, FromJSON, ToJSON, Show)

data RepoCommits =
  RepoCommits { commit :: Commits } deriving (Generic, FromJSON, ToJSON, Show)

data Issue =
  Issue { title :: Text
        , user :: Users
        , state :: Text
        , created_at :: Text
        , reactions :: Reactions
        } deriving (Generic, FromJSON, ToJSON, Show)

data Users =
  Users { login :: Text } deriving (Generic, FromJSON, ToJSON, Show)

data Reactions =
  Reactions { total_count :: Integer
            } deriving (Generic, FromJSON, ToJSON, Show)

data User =
  User { login :: Text
       , name :: Maybe Text
       , avatar_url :: Text
       , public_repos :: Integer
       , followers :: Integer
       , following :: Integer
       } deriving (Generic, FromJSON, ToJSON, Show)

type GitHubAPI = "repos" :> Header "user-agent" UserAgent
            		         :> BasicAuth "github" Int
            		         :> Capture "username" Username
            		         :> Capture "repo" Reponame :> Get '[JSON] GitHubRepo

            :<|> "repos" :> Header  "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username
                         :> Capture "repo"     Reponame  :> "contributors" :>  Get '[JSON] [RepoContributor]

            :<|> "repos" :> Header  "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username
                         :> Capture "repo"     Reponame  :> "commits" :>  Get '[JSON] [RepoCommits]

            :<|> "repos" :> Header "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username
                         :> Capture "repo"     Reponame  :> "issues" :>  Get '[JSON] [Issue]

            :<|> "users" :> Header "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username :> Get '[JSON] User

            :<|> "users" :> Header "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username
                         :> "repos"
                         :> Get '[JSON] [GitHubRepo]


gitHubAPI :: Proxy GitHubAPI
gitHubAPI = Proxy

getRepo ::          Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM GitHubRepo
getRepoContribs ::  Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM [RepoContributor]
getRepoCommits  ::  Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM [RepoCommits]
getRepoIssues  ::   Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM [Issue]
getUser  ::         Maybe UserAgent -> BasicAuthData -> Username -> ClientM User
getRepos ::         Maybe UserAgent -> BasicAuthData -> Username -> ClientM [GitHubRepo]

getRepo :<|> getRepoContribs :<|> getRepoCommits :<|> getRepoIssues :<|> getUser :<|> getRepos = client gitHubAPI
