import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Page from "../components/Page";
import CodeBlock from "../components/CodeBlock";
import { twMerge } from "tailwind-merge";

const PROGRAM_LIST = [
    {
        name: "SystemProgram",
        address: "11111111111111111111111111111111",
        displayName: "SystemProgram",
    },
    {
        name: "SPLToken",
        address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        displayName: "SPLToken",
    },
    {
        name: "SPLNameService",
        address: "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX",
        displayName: "SPLNameService",
    },
    {
        name: "SPLGovernance",
        address: "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw",
        displayName: "SPLGovernance",
    },
    {
        name: "SPLMemo",
        address: "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
        displayName: "SPLMemo",
    },
    {
        name: "SPLStakePool",
        address: "SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy",
        displayName: "SPLStakePool",
    },
    {
        name: "SPLTokenSwap",
        address: "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8",
        displayName: "SPLTokenSwap",
    },
    {
        name: "SPLToken2022",
        address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
        displayName: "SPLToken2022",
    },
    {
        name: "StakeProgram",
        address: "Stake11111111111111111111111111111111111111",
        displayName: "StakeProgram",
    },
    {
        name: "Serum",
        address: "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
        displayName: "Serum",
    },
    {
        name: "OpenbookV2",
        address: "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb",
        displayName: "OpenbookV2",
    },
    {
        name: "MetaplexCandyMachineV1",
        address: "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ",
        displayName: "MetaplexCandyMachineV1",
    },
    {
        name: "MetaplexCandyMachine",
        address: "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ",
        displayName: "MetaplexCandyMachine",
    },
    {
        name: "MetaplexCandyMachineV3",
        address: "CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR",
        displayName: "MetaplexCandyMachineV3",
    },
    {
        name: "MetaplexCandyGuard",
        address: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g",
        displayName: "MetaplexCandyGuard",
    },
    {
        name: "MetaplexAuctionHouse",
        address: "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk",
        displayName: "MetaplexAuctionHouse",
    },
    {
        name: "MetaplexTokenMetadata",
        address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        displayName: "MetaplexTokenMetadata",
    },
    {
        name: "MetaplexMPLCore",
        address: "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
        displayName: "MetaplexMPLCore",
    },
    {
        name: "Hybrid",
        address: "MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb",
        displayName: "Hybrid",
    },
    {
        name: "BonfidaNameTokenizer",
        address: "nftD3vbNkNqfj2Sd3HZwbpw4BxxKWr4AjGb9X38JeZk",
        displayName: "BonfidaNameTokenizer",
    },
    {
        name: "BonfidaNameService",
        address: "jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR",
        displayName: "BonfidaNameService",
    },
    {
        name: "BonfidaAuction",
        address: "AVWV7vdWbLqXiLKFaP19GhYurhwxaLp2qRBSjT5tR5vT",
        displayName: "BonfidaAuction",
    },
    {
        name: "BonfidaDomainsMarketplace",
        address: "85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29",
        displayName: "BonfidaDomainsMarketplace",
    },
    {
        name: "OrcaWhirlpool",
        address: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
        displayName: "OrcaWhirlpool",
    },
    {
        name: "RaydiumLiquidityPool",
        address: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        displayName: "RaydiumLiquidityPool",
    },
    {
        name: "RaydiumConcentratedLiquidity",
        address: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
        displayName: "RaydiumConcentratedLiquidity",
    },
    {
        name: "JupiterAggregatorV1",
        address: "JUP6i4ozu5ydDCnLiMogSckDPpbtr7BJ4FtzYWkb5Rk",
        displayName: "JupiterAggregatorV1",
    },
    {
        name: "JupiterAggregatorV2",
        address: "JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo",
        displayName: "JupiterAggregatorV2",
    },
    {
        name: "JupiterAggregatorV3",
        address: "JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph",
        displayName: "JupiterAggregatorV3",
    },
    {
        name: "JupiterAggregatorV4",
        address: "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB",
        displayName: "JupiterAggregatorV4",
    },
    {
        name: "JupiterAggregatorV5",
        address: "JUP5pEAZeHdHrLxh5UCwAbpjGwYKKoquCpda2hfP4u8",
        displayName: "JupiterAggregatorV5",
    },
    {
        name: "JupiterAggregatorV6",
        address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
        displayName: "JupiterAggregatorV6",
    },
    {
        name: "JupiterDCA",
        address: "DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M",
        displayName: "JupiterDCA",
    },
    {
        name: "JupiterLimitOrder",
        address: "jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu",
        displayName: "JupiterLimitOrder",
    },
    {
        name: "JupiterPerpetuals",
        address: "PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu",
        displayName: "JupiterPerpetuals",
    },
    {
        name: "MarinadeFinance",
        address: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD",
        displayName: "MarinadeFinance",
    },
    {
        name: "MarinadeReferral",
        address: "MR2LqxoSbw831bNy68utpu5n4YqBH3AzDmddkgk9LQv",
        displayName: "MarinadeReferral",
    },
    {
        name: "MarinadeNativeProxy",
        address: "mnspJQyF1KdDEs5c6YJPocYdY1esBgVQFufM2dY9oDk",
        displayName: "MarinadeNativeProxy",
    },
    {
        name: "MagicEdenLaunchPadV3",
        address: "CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb",
        displayName: "MagicEdenLaunchPadV3",
    },
    {
        name: "MagicEdenMarketplaceM2",
        address: "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K",
        displayName: "MagicEdenMarketplaceM2",
    },
    {
        name: "MagicEdenOpenCreatorProtocol",
        address: "ocp4vWUzA2z2XMYJ3QhM9vWdyoyoQwAFJhRdVTbvo9E",
        displayName: "MagicEdenOpenCreatorProtocol",
    },
    {
        name: "SwitchboardV2",
        address: "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f",
        displayName: "SwitchboardV2",
    },
    {
        name: "SwitchboardOnDemand",
        address: "SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv",
        displayName: "SwitchboardOnDemand",
    },
    {
        name: "SwitchboardAttestationProgram",
        address: "sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx",
        displayName: "SwitchboardAttestationProgram",
    },
    {
        name: "SquadsMPLV3",
        address: "SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu",
        displayName: "SquadsMPLV3",
    },
    {
        name: "SquadsMPLV4Multisig",
        address: "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf",
        displayName: "SquadsMPLV4Multisig",
    },
    {
        name: "SquadsTxmeta",
        address: "SMPL5bz5ERMdweouWrXtk3jmb6FnjZkWf7pHDsE6Zwz",
        displayName: "SquadsTxmeta",
    },
    {
        name: "SquadsValidator",
        address: "SMPLbiNbsa19gf9jz8x9uHSvSn9VLFJB38dGy46kqJ7",
        displayName: "SquadsValidator",
    },
    {
        name: "SquadsProgramManager",
        address: "SMPLKTQhrgo22hFCVq2VGX1KAktTWjeizkhrdB1eauK",
        displayName: "SquadsProgramManager",
    },
    {
        name: "HubbleBorrowing",
        address: "HubbLeXBb7qyLHt3x7gvYaRrxQmmgExb7fCJgDqFuB6T",
        displayName: "HubbleBorrowing",
    },
    {
        name: "HubbleKamino",
        address: "6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc",
        displayName: "HubbleKamino",
    },
    {
        name: "TensorSwap",
        address: "TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN",
        displayName: "TensorSwap",
    },
    {
        name: "StarAtlasMarketplace",
        address: "traderDnaR5w6Tcoi3NFm53i48FTDNbGjBSZwWXDRrg",
        displayName: "StarAtlasMarketplace",
    },
    {
        name: "StarAtlasScore",
        address: "FLEET1qqzpexyaDpqb2DGsSzE2sDCizewCg9WjrA6DBW",
        displayName: "StarAtlasScore",
    },
    {
        name: "StarAtlasProxyRewarder",
        address: "gateVwTnKyFrE8nxUUgfzoZTPKgJQZUbLsEidpG4Dp2",
        displayName: "StarAtlasProxyRewarder",
    },
    {
        name: "StarAtlasStaking",
        address: "ATLocKpzDbTokxgvnLew3d7drZkEzLzDpzwgrgWKDbmc",
        displayName: "StarAtlasStaking",
    },
    {
        name: "StarAtlasClaimStake",
        address: "STAKEr4Bh8sbBMoAVmTDBRqouPzgdocVrvtjmhJhd65",
        displayName: "StarAtlasClaimStake",
    },
    {
        name: "StarAtlasFactionEnlistment",
        address: "FACTNmq2FhA2QNTnGM2aWJH3i7zT3cND5CgvjYTjyVYe",
        displayName: "StarAtlasFactionEnlistment",
    },
    {
        name: "StarAtlasEscapeVelocity",
        address: "TESTWCwvEv2idx6eZVQrFFdvEJqGHfVA1soApk2NFKQ",
        displayName: "StarAtlasEscapeVelocity",
    },
    {
        name: "StarAtlasLockedVoter",
        address: "Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG",
        displayName: "StarAtlasLockedVoter",
    },
    {
        name: "StarAtlasSnapshots",
        address: "snapNQkxsiqDWdbNfz8KVB7e3NPzLwtHHA6WV8kKgUc",
        displayName: "StarAtlasSnapshots",
    },
    {
        name: "StarAtlasSage",
        address: "SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6",
        displayName: "StarAtlasSage",
    },
    {
        name: "StarAtlasCrafting",
        address: "Craftf1EGzEoPFJ1rpaTSQG1F6hhRRBAf4gRo9hdSZjR",
        displayName: "StarAtlasCrafting",
    },
    {
        name: "StarAtlasCargo",
        address: "Cargo8a1e6NkGyrjy4BQEW4ASGKs9KSyDyUrXMfpJoiH",
        displayName: "StarAtlasCargo",
    },
    {
        name: "StarAtlasCrafting2",
        address: "CRAFT2RPXPJWCEix4WpJST3E7NLf79GTqZUL75wngXo5",
        displayName: "StarAtlasCrafting2",
    },
    {
        name: "StarAtlasPlayerProfile",
        address: "pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9",
        displayName: "StarAtlasPlayerProfile",
    },
    {
        name: "StarAtlasProfileVault",
        address: "pv1ttom8tbyh83C1AVh6QH2naGRdVQUVt3HY1Yst5sv",
        displayName: "StarAtlasProfileVault",
    },
    {
        name: "StarAtlasProfileFaction",
        address: "pFACSRuobDmvfMKq1bAzwj27t6d2GJhSCHb1VcfnRmq",
        displayName: "StarAtlasProfileFaction",
    },
    {
        name: "StarAtlasFeePayer",
        address: "APR1MEny25pKupwn72oVqMH4qpDouArsX8zX4VwwfoXD",
        displayName: "StarAtlasFeePayer",
    },
    {
        name: "StarAtlasPoints",
        address: "Point2iBvz7j5TMVef8nEgpmz4pDr7tU7v3RjAfkQbM",
        displayName: "StarAtlasPoints",
    },
    {
        name: "StarAtlasPointsStore",
        address: "PsToRxhEPScGt1Bxpm7zNDRzaMk31t8Aox7fyewoVse",
        displayName: "StarAtlasPointsStore",
    },
    {
        name: "StarAtlasSage2",
        address: "SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE",
        displayName: "StarAtlasSage2",
    },
    {
        name: "AuroryComptoir",
        address: "comp8FLpN5bbNUC2fhnkFtM7T16DWvaHs8N5dcaoZWP",
        displayName: "AuroryComptoir",
    },
    {
        name: "AuroryOpenStaking",
        address: "STkwf3sbMapjy7KV3hgrJtcVvY4SvRxWQ8pj4Enw1i5",
        displayName: "AuroryOpenStaking",
    },
    {
        name: "AuroryLockedStaking",
        address: "StKLLTf7CQ9n5BgXPSDXENovLTCuNc7N2ehvTb6JZ5x",
        displayName: "AuroryLockedStaking",
    },
    {
        name: "AuroryCasier",
        address: "CAsieqooSrgVxhgWRwh21gyjq7Rmuhmo4qTW9XzXtAvW",
        displayName: "AuroryCasier",
    },
    {
        name: "DriftLabsDrift",
        address: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
        displayName: "DriftLabsDrift",
    },
    {
        name: "GenopetsStaking",
        address: "StaKe9nb7aUjXpjpZ45o6uJBsZxj2BWCDBtjk8LCg2v",
        displayName: "GenopetsStaking",
    },
    {
        name: "GenopetsCraftingManager",
        address: "CrAFTUv7zKXBaS5471aCwHx7mq9Jp1eQQB5FQgdiSLyi",
        displayName: "GenopetsCraftingManager",
    },
    {
        name: "GenopetsHabitatManager",
        address: "HAbiTatJVqoCJd9asyr6RxMEdwtfrQugwp7VAFyKWb1g",
        displayName: "GenopetsHabitatManager",
    },
    {
        name: "BackpackXNFT",
        address: "xnft5aaToUM4UFETUQfj7NUDUBdvYHTVhNFThEYTm55",
        displayName: "BackpackXNFT",
    },
    {
        name: "Bubblegum",
        address: "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
        displayName: "Bubblegum",
    },
    {
        name: "MrgnMarginfi",
        address: "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA",
        displayName: "MrgnMarginfi",
    },
    {
        name: "EllipsisLabsPhoenixV1",
        address: "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY",
        displayName: "EllipsisLabsPhoenixV1",
    },
    {
        name: "Sharky",
        address: "SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP",
        displayName: "Sharky",
    },
    {
        name: "LifinitySwap",
        address: "EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S",
        displayName: "LifinitySwap",
    },
    {
        name: "LifinitySwapV2",
        address: "2wT8Yq49kHgDzXuPxZSaeLaH1qbmGXtEyPy64bL7aD3c",
        displayName: "LifinitySwapV2",
    },
    {
        name: "SolanaBPFLoaderUpgradable",
        address: "BPFLoaderUpgradeab1e11111111111111111111111",
        displayName: "SolanaBPFLoaderUpgradable",
    },
    {
        name: "SolanaComputeBudget",
        address: "ComputeBudget111111111111111111111111111111",
        displayName: "SolanaComputeBudget",
    },
    {
        name: "ZetaDex",
        address: "ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD",
        displayName: "ZetaDex",
    },
    {
        name: "Farms",
        address: "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr",
        displayName: "Farms",
    },
    {
        name: "MangoMarketV4",
        address: "4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg",
        displayName: "MangoMarketV4",
    },
    {
        name: "MeteoraDLMM",
        address: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
        displayName: "MeteoraDLMM",
    },
    {
        name: "HeliumCircuitBreaker",
        address: "circAbx64bbsscPbQzZAUvuXpHqrCe6fLMzc2uKXz9g",
        displayName: "HeliumCircuitBreaker",
    },
    {
        name: "HeliumDataCredits",
        address: "credMBJhYFzfn7NxBMdU4aUqFggAjgztaCcv2Fo6fPT",
        displayName: "HeliumDataCredits",
    },
    {
        name: "HeliumEntityManagerV2",
        address: "hemjuPXBpNvggtaUnN1MwT3wrdhttKEfosTcc2P9Pg8",
        displayName: "HeliumEntityManagerV2",
    },
    {
        name: "HeliumSubDaos",
        address: "hdaoVTCqhfHHo75XdAMxBKdUqvq1i5bF23sisBqVgGR",
        displayName: "HeliumSubDaos",
    },
    {
        name: "HeliumLazyDistributor",
        address: "1azyuavdMyvsivtNxPoz6SucD18eDHeXzFCUPq5XU7w",
        displayName: "HeliumLazyDistributor",
    },
    {
        name: "HeliumLazyTransactions",
        address: "1atrmQs3eq1N2FEYWu6tyTXbCjP4uQwExpjtnhXtS8h",
        displayName: "HeliumLazyTransactions",
    },
    {
        name: "HeliumTreasuryManagement",
        address: "treaf4wWBBty3fHdyBpo35Mz84M8k3heKXmjmi9vFt5",
        displayName: "HeliumTreasuryManagement",
    },
    {
        name: "HeliumVoterStakeRegistry",
        address: "hvsrNC3NKbcryqDs2DocYHZ9yPKEVzdSjQG6RVtK1s8",
        displayName: "HeliumVoterStakeRegistry",
    },
    {
        name: "Solend",
        address: "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo",
        displayName: "Solend",
    },
    {
        name: "WormholeCore",
        address: "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth",
        displayName: "WormholeCore",
    },
    {
        name: "WormholeTokenBridge",
        address: "wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb",
        displayName: "WormholeTokenBridge",
    },
    {
        name: "WormholeNFTBridge",
        address: "WnFt12ZrnzZrFZkt2xsNsaNWoQribnuQ5B5FrDbwDhD",
        displayName: "WormholeNFTBridge",
    },
    {
        name: "AllDomainsTLDHouse",
        address: "TLDHkysf5pCnKsVA4gXpNvmy7psXLPEu4LAdDJthT9S",
        displayName: "AllDomainsTLDHouse",
    },
    {
        name: "AllDomainsAltNameService",
        address: "ALTNSZ46uaAUU7XUV6awvdorLGqAsPwa9shm7h4uP2FK",
        displayName: "AllDomainsAltNameService",
    },
    {
        name: "AllDomainsTLDManager",
        address: "TLDM2itbqSCEGnCBEF5ExqbePWQGJpkAW2t5noVqHu9",
        displayName: "AllDomainsTLDManager",
    },
    {
        name: "AllDomainsNameHouse",
        address: "NH3uX6FtVE2fNREAioP7hm5RaozotZxeL6khU1EHx51",
        displayName: "AllDomainsNameHouse",
    },
    {
        name: "AllDomainsTLDPool",
        address: "APooLSMjJV9kkqEWX2QvDyStkdPesVugMALsMvPLbsnx",
        displayName: "AllDomainsTLDPool",
    },
    {
        name: "FlashTradePerpetuals",
        address: "FLASH6Lo6h3iasJKWDs2F8TkW2UKf3s15C8PMGuVfgBn",
        displayName: "FlashTradePerpetuals",
    },
    {
        name: "FlashTradePerpComposability",
        address: "FSWAPViR8ny5K96hezav8jynVubP2dJ2L7SbKzds2hwm",
        displayName: "FlashTradePerpComposability",
    },
    {
        name: "Allbridge",
        address: "BrdgN2RPzEMWF96ZbnnJaUtQDQx7VRXYaHHbYCBvceWB",
        displayName: "Allbridge",
    },
    {
        name: "Debridge",
        address: "DEbrdGj3HsRsAzx6uH4MKyREKxVAfBydijLUF3ygsFfh",
        displayName: "Debridge",
    },
    {
        name: "KaminoLending",
        address: "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
        displayName: "KaminoLending",
    },
    {
        name: "TensorWhitelist",
        address: "TL1ST2iRBzuGTqLn1KXnGdSnEow62BzPnGiqyRXhWtW",
        displayName: "TensorWhitelist",
    },
    {
        name: "TensorBid",
        address: "TB1Dqt8JeKQh7RLDzfYDJsq8KS4fS2yt87avRjyRxMv",
        displayName: "TensorBid",
    },
    {
        name: "TensorCnft",
        address: "TCMPhJdwDryooaGtiocG1u3xcYbRpiJzb283XfCZsDp",
        displayName: "TensorCnft",
    },
    {
        name: "TensorTstake",
        address: "TSTKEiz9sqJRypokAkRhaW29rnDYDSxqWxmdv9brkp2",
        displayName: "TensorTstake",
    },
    {
        name: "TensorSwapSorian",
        address: "SWPhxKY7ponWjkfYCnvWypX8pEMe9hvQHhKo9wS7vim",
        displayName: "TensorSwapSorian",
    },
    {
        name: "TensorTroll",
        address: "TRoLL7U1qTaqv2FFQ4jneZx5SetannKmrYCR778AkQZ",
        displayName: "TensorTroll",
    },
    {
        name: "TensorTlock",
        address: "TLoCKic2wGJm7VhZKumih4Lc35fUhYqVMgA4j389Buk",
        displayName: "TensorTlock",
    },
    {
        name: "TensorDropMachine",
        address: "TDRoPy8i5G8AMzuaGPb98fxDRevS81kfhVeaipyWGbN",
        displayName: "TensorDropMachine",
    },
    {
        name: "TensorDropGuard",
        address: "TGARDaEzs7px1tEUssCCZ9ewhTW7oCA1MnY5y7rQk9n",
        displayName: "TensorDropGuard",
    },
    {
        name: "HelioProtocol",
        address: "ENicYBBNZQ91toN7ggmTxnDGZW14uv9UkumN7XBGeYJ4",
        displayName: "HelioProtocol",
    },
    {
        name: "HelioNftProtocol",
        address: "Gfz4VD7NmjyxeQexzLtwqpxUVkXHGQ61BTD6XUB5j55x",
        displayName: "HelioNftProtocol",
    },
    {
        name: "NosanaStaking",
        address: "nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE",
        displayName: "NosanaStaking",
    },
    {
        name: "NosanaJobs",
        address: "nosJhNRqr2bc9g1nfGDcXXTXvYUmxD4cVwy2pMWhrYM",
        displayName: "NosanaJobs",
    },
    {
        name: "NosanaPools",
        address: "nosPdZrfDzND1LAR28FLMDEATUPK53K8xbRBXAirevD",
        displayName: "NosanaPools",
    },
    {
        name: "NosanaRewards",
        address: "nosRB8DUV67oLNrL45bo2pFLrmsWPiewe2Lk2DRNYCp",
        displayName: "NosanaRewards",
    },
    {
        name: "Pump",
        address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
        displayName: "Pump",
    },
    {
        name: "PushOracle",
        address: "pythWSnswVUd12oZpeFP8e9CVaEqJg25g1Vtc2biRsT",
        displayName: "PushOracle",
    },
    {
        name: "SolanaReceiver",
        address: "rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ",
        displayName: "SolanaReceiver",
    },
    {
        name: "Controller",
        address: "5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx",
        displayName: "Controller",
    },
    {
        name: "Router",
        address: "stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq",
        displayName: "Router",
    },
    {
        name: "Unstake",
        address: "unpXTU2Ndrc7WWNyEhQWe4udTzSibLPi25SXv2xbCHQ",
        displayName: "Unstake",
    },
    {
        name: "LandToken",
        address: "HAS8wvo7CPg7nmzbQoxJ4KDEqLyskxDG2p9HGHZ9ub77",
        displayName: "LandToken",
    },
    {
        name: "Rental",
        address: "HmqstutaEpbddgt5hjhJAsnrXhTUfQpveCpyWEvEdnWM",
        displayName: "Rental",
    },
];

const SearchInput = ({ placeholder, onChange, value }) => (
    <span className="inline-flex h-[40px] p-2.5 bg-white items-center gap-1 rounded">
        <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>

        <input
            className="h-6 outline-transparent min-w-56"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </span>
);

const SearchHeader = ({ selectedProgram, onChange, value, onReset }) => {
    return (
        <div className="flex justify-between border-b border-[#C3CFFF] py-4 min-h-20">
            <div
                className={twMerge(
                    "flex flex-col gap-1 text-[18px] text-[#374151]",
                    selectedProgram ? "font-bold" : ""
                )}
            >
                <span>
                    <span
                        onClick={onReset}
                        className={selectedProgram ? "cursor-pointer" : ""}
                    >
                        Solana programs
                    </span>
                    {selectedProgram ? (
                        <>
                            {" / "}
                            <span className="font-normal">
                                {selectedProgram.displayName}
                            </span>
                        </>
                    ) : (
                        ""
                    )}
                </span>
                {!selectedProgram && (
                    <span className="text-[12px] text-[#4F5A6C]">
                        Search for your favourite dApps
                    </span>
                )}
            </div>
            {!selectedProgram && (
                <SearchInput
                    value={value}
                    placeholder="Search by name or address"
                    onChange={onChange}
                />
            )}
        </div>
    );
};

function Programs() {
    const [selectedProgram, setSelectedProgram] = useState();
    const [searchText, setSearchText] = useState("");
    const { data: dappDetails, isLoading: dappDetailsLoading } = useQuery({
        queryKey: ["ProgramData", selectedProgram?.address],
        queryFn: () => {
            return fetch("/api/fetch-parser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dapp_address: selectedProgram.address }),
            }).then((res) => res.json());
        },
        enabled: !!selectedProgram?.address,
        staleTime: 1000 * 1800, // 30mins
    });

    const search = (program) => {
        if (!searchText || searchText?.length < 2) return true;

        return (
            program.displayName.toLowerCase().includes(searchText) ||
            program.address.toLowerCase().includes(searchText)
        );
    };

    return (
        <Page>
            <div className="px-32 mt-20">
                <SearchHeader
                    selectedProgram={selectedProgram}
                    onChange={setSearchText}
                    onReset={() => setSelectedProgram(null)}
                    value={searchText}
                />
                {!selectedProgram && (
                    <ul className="list-none mt-5 flex flex-col gap-4">
                        {PROGRAM_LIST.filter(search).map((program) => (
                            <li
                                onClick={() => setSelectedProgram(program)}
                                className="cursor-pointer"
                            >
                                <div className="border-2 border-[#C2C2FF] py-5 px-8 rounded flex flex-col gap-1">
                                    <span className="text-[#374151] text-[18px] font-semibold">
                                        {program.displayName}
                                    </span>
                                    <span className="text-[#4F5A6C] text-[14px]">
                                        {program.address}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedProgram && (
                    <>
                        {selectedProgram &&
                            !dappDetailsLoading &&
                            !dappDetails?.instruction_discriminators &&
                            !dappDetails?.event_discriminators &&
                            !dappDetails?.input_account_mappings &&
                            !dappDetails?.python_parser && (
                                <div className="w-full min-h-80 flex items-center justify-center border border-transparent rounded mt-10 text-lg text-[#223344]">
                                    No Data found for selected program
                                </div>
                            )}
                        {dappDetailsLoading && (
                            <div className="w-full min-h-80 flex items-center justify-center">
                                <svg
                                    className="h-7 w-7 text-[#aaa] animate-[spin_3s_linear_infinite]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <line x1="12" y1="2" x2="12" y2="6" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line
                                        x1="4.93"
                                        y1="4.93"
                                        x2="7.76"
                                        y2="7.76"
                                    />
                                    <line
                                        x1="16.24"
                                        y1="16.24"
                                        x2="19.07"
                                        y2="19.07"
                                    />
                                    <line x1="2" y1="12" x2="6" y2="12" />
                                    <line x1="18" y1="12" x2="22" y2="12" />
                                    <line
                                        x1="4.93"
                                        y1="19.07"
                                        x2="7.76"
                                        y2="16.24"
                                    />
                                    <line
                                        x1="16.24"
                                        y1="7.76"
                                        x2="19.07"
                                        y2="4.93"
                                    />
                                </svg>
                            </div>
                        )}
                        {!!dappDetails &&
                            !!dappDetails.instruction_discriminators && (
                                <>
                                    <CodeBlock
                                        title="Instruction Discriminators"
                                        text={dappDetails.instruction_discriminators.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails &&
                            !!dappDetails.event_discriminators && (
                                <>
                                    <CodeBlock
                                        title="Event Discriminators"
                                        text={dappDetails.event_discriminators.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails &&
                            !!dappDetails.input_account_mappings && (
                                <>
                                    <CodeBlock
                                        title="Input Account Mappings"
                                        text={dappDetails.input_account_mappings.join(
                                            "\n"
                                        )}
                                        verified={true}
                                    />
                                </>
                            )}

                        {!!dappDetails && !!dappDetails.python_parser && (
                            <>
                                <CodeBlock
                                    title="Python Parser"
                                    text={dappDetails.python_parser}
                                    verified={true}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </Page>
    );
}

export default Programs;
