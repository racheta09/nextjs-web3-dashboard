import React from "react"
import useSWR from "swr"
import Web3 from "web3"
import { useEffect, useState } from "react"
import { Grid, Paper } from "@mui/material"

import eversafu from "../json/eversafu.json"
import dividenddistributor from "../json/dividenddistributor.json"

import Datagrid from "../components/Datagrid"

const Dashboard = () => {
    let dashboardData = {
        price: {
            title: "CIP Price",
            value: "",
        },
        marketCap: {
            title: "Market Cap",
            value: "",
        },
        totalSupply: {
            title: "Total Supply",
            value: "",
        },
        circulatingSupply: {
            title: "Circulating Supply",
            value: "",
        },
        totalDividends: {
            title: "Total Dividends",
            value: "",
        },
        busdDistributed: {
            title: "BUSD Distributed",
            value: "",
        },
        dividendValue: {
            title: "Dividend Value",
            value: "",
        },
        poolValue: {
            title: "Pool Value",
            value: "",
        },
        lastRebase: {
            title: "Last Rebase",
            value: "",
        },
        lastLiquidity: {
            title: "Last Liquidity",
            value: "",
        },
        autoLiquidityBal: {
            title: "Auto Liquidity Value",
            value: "",
        },
        autoLiquidityBusd: {
            title: "Auto Liquidity BUSD Value",
            value: "",
        },
        burnedValue: {
            title: "CIP Burned",
            value: "",
        },
        burnedBusdValue: {
            title: "CIP Burned Value",
            value: "",
        },
        burnedPercent: {
            title: "CIP Burned Percent",
            value: "",
        },
        treasuryValue: {
            title: "Treasury Assets Value",
            value: "",
        },
    }
    const [data, setData] = useState(dashboardData)
    const [sinceRebase, setSinceRebase] = useState("")
    const [sinceLiquidity, setSinceLiquidity] = useState("")

    const web3 = new Web3("https://bsc-dataseed.binance.org/")
    const esContract = new web3.eth.Contract(
        JSON.parse(eversafu.abi),
        eversafu.address
    )
    const ddContract = new web3.eth.Contract(
        JSON.parse(dividenddistributor.abi),
        dividenddistributor.address
    )
    const busdContract = new web3.eth.Contract(
        JSON.parse(eversafu.abi),
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
    )
    const wbnbContract = new web3.eth.Contract(
        JSON.parse(eversafu.abi),
        "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    )

    const treasuryAddress = "0xcC336eCa9110c46ec9890297d7335405C91d21De"
    const autoLiquidityAddress = "0xa9494e3fF124B319D391AC5c2dC8c33820F0C69C"
    const pairAddress = "0xa6c3950ff1b6fd0b10171be420deea5912284160"
    const wbnbbusdAddress = "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16"
    const deadAddress = "0x000000000000000000000000000000000000dEaD"
    const zeroAddress = "0x0000000000000000000000000000000000000000"

    const fetcher = async () => {
        let w3data = {}
        w3data.decimals = await esContract.methods.decimals().call()
        w3data.lastRebase = await esContract.methods._lastRebasedTime().call()
        w3data.lastLiquidity = await esContract.methods
            ._lastAddLiquidityTime()
            .call()
        w3data.autoLiquidityBal = await esContract.methods
            .balanceOf(autoLiquidityAddress)
            .call()
        w3data.deadBal = await esContract.methods.balanceOf(deadAddress).call()
        w3data.zeroBal = await esContract.methods.balanceOf(zeroAddress).call()
        w3data.treasuryBalBnb = await web3.eth.getBalance(treasuryAddress)
        w3data.treasuryBalBusd = await busdContract.methods
            .balanceOf(treasuryAddress)
            .call()
        w3data.dividendBusdBal = await busdContract.methods
            .balanceOf(dividenddistributor.address)
            .call()
        w3data.pairBal = await esContract.methods.balanceOf(pairAddress).call()
        w3data.pairWbnbBal = await wbnbContract.methods
            .balanceOf(pairAddress)
            .call()
        w3data.wbnbpairBal = await wbnbContract.methods
            .balanceOf(wbnbbusdAddress)
            .call()
        w3data.busdpairBal = await busdContract.methods
            .balanceOf(wbnbbusdAddress)
            .call()
        w3data.totalSupply = await esContract.methods._totalSupply().call()
        w3data.circulatingSupply = await esContract.methods
            .getCirculatingSupply()
            .call()

        w3data.busdDistributed = await ddContract.methods
            .totalDistributed()
            .call()
        w3data.totalDividends = await ddContract.methods.totalDividends().call()
        // console.log(w3data)
        return w3data
    }
    const { data: w3data, error } = useSWR("dashboard", fetcher, {
        refreshInterval: 5000,
    })

    const timeSince = (time) => {
        const hours = Math.floor(time / (60 * 60 * 1000))
        const mins = Math.floor((time - hours * 60 * 60 * 1000) / (60 * 1000))
        const secs = Math.floor(
            (time - hours * 60 * 60 * 1000 - mins * 60 * 1000) / 1000
        )
        return [hours, mins, secs]
    }

    const parseData = () => {
        if (w3data) {
            let dData = data
            let bnbPrice =
                parseInt(w3data.busdpairBal) / parseInt(w3data.wbnbpairBal)
            let tokenPrice =
                (parseInt(w3data.pairWbnbBal) * 10 ** -18) /
                parseInt(w3data.pairBal * 10 ** -5)

            dData.price.value = `$${(tokenPrice * bnbPrice).toLocaleString(
                "en-US"
            )}`

            dData.marketCap.value = `$${(
                parseInt(w3data.totalSupply) *
                10 ** -5 *
                tokenPrice *
                bnbPrice
            ).toLocaleString("en-US")}`

            dData.circulatingSupply.value = `${(
                parseInt(w3data.circulatingSupply) *
                10 ** -5
            ).toLocaleString("en-US")} CIP`

            dData.totalSupply.value = `${(
                parseInt(w3data.totalSupply) *
                10 ** -5
            ).toLocaleString("en-US")} CIP`

            dData.totalDividends.value = `${(
                parseInt(w3data.totalDividends) *
                10 ** -18
            ).toLocaleString("en-US")} BUSD`
            dData.busdDistributed.value = `${(
                parseInt(w3data.busdDistributed) *
                10 ** -18
            ).toLocaleString("en-US")} BUSD`
            dData.autoLiquidityBal.value = `${(
                parseInt(w3data.autoLiquidityBal) *
                10 ** -5
            ).toLocaleString("en-US")} CIP`
            dData.autoLiquidityBusd.value = `${(
                parseInt(w3data.autoLiquidityBal) *
                10 ** -5 *
                tokenPrice *
                bnbPrice
            ).toLocaleString("en-US")} BUSD`
            dData.burnedValue.value = `${(
                parseInt(w3data.deadBal) * 10 ** -5 +
                parseInt(w3data.zeroBal) * 10 ** -5
            ).toLocaleString("en-US")} CIP`
            dData.burnedBusdValue.value = `${(
                (parseInt(w3data.deadBal) * 10 ** -5 +
                    parseInt(w3data.zeroBal) * 10 ** -5) *
                tokenPrice *
                bnbPrice
            ).toLocaleString("en-US")} BUSD`
            dData.burnedPercent.value = `${(
                (parseInt(w3data.deadBal) +
                    parseInt(w3data.zeroBal) ) /
                    parseInt(w3data.totalSupply) * 100
            ).toLocaleString("en-US")}%`
            dData.treasuryValue.value = `${(
                parseInt(w3data.treasuryBalBnb) * 10 ** -18 * bnbPrice +
                parseInt(w3data.treasuryBalBusd) * 10 ** -18
            ).toLocaleString("en-US")} BUSD`
            dData.dividendValue.value = `${(
                parseInt(w3data.dividendBusdBal) *
                10 ** -18
            ).toLocaleString("en-US")} BUSD`
            dData.poolValue.value = `${(
                parseInt(w3data.pairBal) * 10 ** -5 * tokenPrice * bnbPrice +
                parseInt(w3data.pairWbnbBal) * 10 ** -18 * bnbPrice
            ).toLocaleString("en-US")} BUSD`

            setData(dData)
        }
    }

    useEffect(() => {
        let tData = data
        tData.lastRebase.value = `${sinceRebase}`
        tData.lastLiquidity.value = `${sinceLiquidity}`
        setData(tData)
    }, [sinceRebase, sinceLiquidity])

    useEffect(() => {
        parseData()
        const timer = setInterval(() => {
            if (w3data) {
                const paddDigits = (num) =>
                    num < 10 ? "0" + num.toString() : num.toString()

                let rdiffTime = Date.now() - parseInt(w3data.lastRebase) * 1000
                let dRebase = timeSince(rdiffTime)
                setSinceRebase(
                    `${paddDigits(dRebase[0])}:${paddDigits(
                        dRebase[1]
                    )}:${paddDigits(dRebase[2])}`
                )

                let ldiffTime =
                    Date.now() - parseInt(w3data.lastLiquidity) * 1000
                let dLiquidity = timeSince(ldiffTime)
                setSinceLiquidity(
                    `${paddDigits(dLiquidity[0])}:${paddDigits(
                        dLiquidity[1]
                    )}:${paddDigits(dLiquidity[2])}`
                )
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [w3data])

    if (error) return "error"
    // if (!data) return "Loading"

    return (
        <Paper
            sx={{
                padding: "1rem",
                margin: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "rgba(12,14,14,0.1)",
                textAlign: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
                letterSpacing: "0.1rem",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0px 0px 10px rgba(238,45,15,0.1)",
            }}
        >
            <Grid
                container
                spacing={{ xs: 2, md: 4 }}
                //   columns={{ xs: 4, sm: 8, md: 12 }}

                justifyContent="space-evenly"
                alignItems="center"
            >
                {Object.keys(data).map((item, index) => (
                    <Datagrid
                        key={index}
                        title={data[item].title}
                        value={data[item].value}
                    />
                ))}
            </Grid>
        </Paper>
    )
}

export default Dashboard
