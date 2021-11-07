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
             , fullname :: Maybe Text
             , language :: Maybe Text
             } deriving (Generic, FromJSON, ToJSON, Show)

data RepoContributor =
  RepoContributor { login :: Text
                  , contributions :: Integer
                  } deriving (Generic, FromJSON, ToJSON, Show)

type GitHubAPI = "repos" :> Header "user-agent" UserAgent
            		         :> BasicAuth "github" Int
            		         :> Capture "username" Username
            		         :> Capture "repo" Reponame :> Get '[JSON] GitHubRepo

            :<|> "repos" :> Header  "user-agent" UserAgent
                         :> BasicAuth "github" Int
                         :> Capture "username" Username
                         :> Capture "repo"     Reponame  :> "contributors" :>  Get '[JSON] [RepoContributor]

gitHubAPI :: Proxy GitHubAPI
gitHubAPI = Proxy

getRepo ::          Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM GitHubRepo
getRepoContribs ::  Maybe UserAgent -> BasicAuthData -> Username -> Reponame -> ClientM [RepoContributor]

getRepo :<|> getRepoContribs = client gitHubAPI
