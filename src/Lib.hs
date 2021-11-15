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
testGitHubCall auth name repo =
  (SC.runClientM (GH.getRepo (Just "haskell-app") auth name repo) =<< env) >>= \case

    Left err -> do
      Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
    Right rep -> do
      I.writeFile "github_visualisation/src/repofile.json" (encodeToLazyText rep)

      (SC.runClientM (GH.getRepoContribs (Just "haskell-app") auth name repo) =<< env) >>= \case
        Left err -> do
          Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
        Right lang -> do
          I.writeFile "github_visualisation/src/contribfile.json" (encodeToLazyText lang)

          (SC.runClientM (GH.getRepoCommits (Just "haskell-app") auth name repo) =<< env) >>= \case
            Left err -> do
              Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
            Right com -> do
              I.writeFile "github_visualisation/src/commitfile.json" (encodeToLazyText com)

              (SC.runClientM (GH.getRepoIssues (Just "haskell-app") auth name repo) =<< env) >>= \case
                Left err -> do
                  Prelude.putStrLn $ "heuston, we have a problem: " ++ show err
                Right iss -> do
                  I.writeFile "github_visualisation/src/issuefile.json" (encodeToLazyText iss)

                  (partitionEithers <$> mapM (getUsers auth) lang) >>= \case

                    ([], contribs) -> do
                      I.writeFile "github_visualisation/src/userfile.json" (encodeToLazyText contribs)
                      (partitionEithers <$> mapM (getRepos auth) contribs) >>= \case
                        ([], repositories) -> do
                          I.writeFile "github_visualisation/src/userrepofile.json" (encodeToLazyText repositories)

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

        groupContributors :: [GH.RepoContributor] -> [GH.RepoContributor]
        groupContributors  = sortBy (\(GH.RepoContributor _ c1) (GH.RepoContributor _ c2) ->  compare c1 c2) .
                             map mapfn .
                             groupBy (\(GH.RepoContributor l1 _) (GH.RepoContributor l2 _) ->  l1 == l2)
         where mapfn :: [GH.RepoContributor] -> GH.RepoContributor
               mapfn xs@((GH.RepoContributor l _):_) = GH.RepoContributor l . sum $
                                                       map (\(GH.RepoContributor _ c) -> c)  xs
