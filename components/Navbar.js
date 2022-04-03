import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material"
import { useState, useEffect } from "react"
import Web3 from "web3"

import logo from "../public/CIP-3.0logo.png"

import dividenddistributor from "../json/dividenddistributor.json"
import Image from "next/image"

export const Navbar = () => {
    const [wallet, setWallet] = useState(null)
    const [reward, setReward] = useState(null)

    const connect = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum)
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            setWallet(accounts[0])
            const ddContract = new web3.eth.Contract(
                JSON.parse(dividenddistributor.abi),
                dividenddistributor.address
            )
            let rewards = await ddContract.methods
                .getUnpaidEarnings(accounts[0])
                .call()
            setReward(parseInt(rewards) * 10 ** -18)
        }
    }

    const claim = async () => {
        await window.ethereum.enable()
        const web3 = new Web3(window.ethereum)
        const ddContract = new web3.eth.Contract(
            JSON.parse(dividenddistributor.abi),
            dividenddistributor.address
        )
        await ddContract.methods.claimDividend().send({ from: wallet })
    }

    useEffect(() => {
        if (window.ethereum) {
            setWallet(1)
            const getClaims = async () => {
                const web3 = new Web3(window.ethereum)
                const ddContract = new web3.eth.Contract(
                    JSON.parse(dividenddistributor.abi),
                    dividenddistributor.address
                )
                let acc = await web3.eth.getAccounts()
                if (acc.length > 0) {
                    let rewards = await ddContract.methods
                        .getUnpaidEarnings(acc[0])
                        .call()
                    setWallet(acc[0])
                    setReward(parseInt(rewards) * 10 ** -18)
                }
            }
            getClaims()
        }
    }, [])

    return (
        <AppBar position="static" color="transparent">
            <Toolbar>
                <Image src="/CIP-3.0logo.png" alt="logo" width="286px" height="66px"/>
                {/* <Image src="/faviconcip.png" alt="logo" width="100%" height="100%"/> */}
                <Typography variant="h3" component="div" sx={{ flexGrow: 1, p:"10px" }}>
                    Dashboard
                </Typography>
                {wallet ? (
                    typeof wallet === "string" ? (
                        <>
                            <Typography variant="subtitle1">
                                {reward} BUSD
                            </Typography>
                            <Button onClick={claim} variant="filled" size="big">
                                Claim
                            </Button>
                        </>
                    ) : (
                        <Button onClick={connect} variant="filled" size="big">
                            Connect
                        </Button>
                    )
                ) : (
                    <Button
                        variant="filled"
                        href="https://metamask.io/"
                        target={"_blank"}
                        size="big"
                    >
                        Install Metamask
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}
