{-# LANGUAGE DataKinds            #-}
{-# LANGUAGE DeriveAnyClass       #-}
{-# LANGUAGE DeriveGeneric        #-}
{-# LANGUAGE FlexibleContexts     #-}
{-# LANGUAGE FlexibleInstances    #-}
{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE StandaloneDeriving   #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE TypeOperators        #-}
{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE DuplicateRecordFields     #-}

module Lib
    ( someFunc
    ) where

import qualified GitHub as GH
import qualified Servant.Client               as SC
import           Network.HTTP.Client          (newManager)
import           Network.HTTP.Client.TLS      (tlsManagerSettings)
import           System.Environment           (getArgs)
import Data.Text hiding (map,intercalate, groupBy, concat)
import Data.List (intercalate, groupBy, sortBy)
import Data.Either
import           Servant.API                (BasicAuthData (..))
import Data.ByteString.UTF8 (fromString)
import Data.Text.Lazy (Text)
import Data.Text.Lazy.IO as I
import Data.Aeson.Text (encodeToLazyText)
import Data.Aeson (ToJSON)

someFunc :: IO ()
someFunc = do
  Prelude.putStrLn "Let's try a GitHubCall"
  (rName:repos:user:token:_) <- getArgs
  Prelude.putStrLn $ "name is " ++ rName
  Prelude.putStrLn $ "github account for API call is " ++ user
  Prelude.putStrLn $ "github token for api call is " ++ token

  let auth = BasicAuthData (fromString user) (fromString token)

  testGitHubCall auth (pack rName) (pack repos)
  Prelude.putStrLn "end."


testGitHubCall :: BasicAuthData -> Data.Text.Text -> Data.Text.Text -> IO ()
-- fetch main repo
testGitHubCall auth name repo =
  (SC.runClientM (GH.getRepo (Just "haskell-app") auth name repo) =<< env) >>= \case

    Left err -> do
      Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
    Right rep -> do
      I.writeFile "github_visualisation/src/data/repofile.json" (encodeToLazyText rep)

      -- fetch repo contributors
      (SC.runClientM (GH.getRepoContribs (Just "haskell-app") auth name repo) =<< env) >>= \case
        Left err -> do
          Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
        Right lang -> do
          I.writeFile "github_visualisation/src/data/contribfile.json" (encodeToLazyText lang)

          -- fetch repo commits
          (SC.runClientM (GH.getRepoCommits (Just "haskell-app") auth name repo) =<< env) >>= \case
            Left err -> do
              Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
            Right com -> do
              I.writeFile "github_visualisation/src/data/commitfile.json" (encodeToLazyText com)

              -- fetch issues
              (SC.runClientM (GH.getRepoIssues (Just "haskell-app") auth name repo) =<< env) >>= \case
                Left err -> do
                  Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
                Right iss -> do
                  I.writeFile "github_visualisation/src/data/issuefile.json" (encodeToLazyText iss)

                  (partitionEithers <$> mapM (getUsers auth) lang) >>= \case
                  -- fetch the profile of each contributor
                    ([], contribs) -> do
                      I.writeFile "github_visualisation/src/data/userfile.json" (encodeToLazyText contribs)
                      -- fetch the repositories owned by each contributor
                      (partitionEithers <$> mapM (getRepos auth) contribs) >>= \case
                        ([], repositories) -> do
                          I.writeFile "github_visualisation/src/data/userrepofile.json" (encodeToLazyText repositories)

                        (errs, _)-> do
                          Prelude.putStrLn $ "heuston, we have a problem (getting repos): " ++ show errs

                    (ers, _)-> do
                      Prelude.putStrLn $ "heuston, we have a problem (getting contributors): " ++ show ers

  where env :: IO SC.ClientEnv
        env = do
          manager <- newManager tlsManagerSettings
          return $ SC.mkClientEnv manager (SC.BaseUrl SC.Http "api.github.com" 80 "")


        getUsers auth (GH.RepoContributor name _) =
          SC.runClientM (GH.getUser (Just "haskell-app") auth name) =<< env

        getRepos auth (GH.User login _ _ _ _ _) =
          SC.runClientM (GH.getRepos (Just "haskell-app") auth login) =<< env
