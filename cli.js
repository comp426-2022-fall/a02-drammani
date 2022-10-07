#!/usr/bin/env node
import minimist from "minimist"
import moment from "moment-timezone"
import fetch from "node-fetch"

var argv = minimist(process.argv.slice(2))

if(argv.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("   -h          Show this help message and exit.")
    console.log("   -n, -s      Latitude: N positive; S negative.")
    console.log("   -e, -w      Longitude: E positive; W negative.")
    console.log("   -z          Time zone: uses tz.guess() from moment-timezone by default.")
    console.log("   -d 0-6      Day to retieve weather: 0 is today; defaults to 1.")
    console.log("   -j          Echo pretty JSON from open-meteo API and exit.")
    process.exit(0)
}

const timezone = argv.z || moment.tz.guess()

const latitude = argv.n || -1*argv.s
const longitude = argv.e || -1*argv.w

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&daily=precipitation_hours&timezone='+timezone)
const data = await response.json()

if(argv.j) {
    console.log(data)
    process.exit(0)
}

const days = argv.d

if(data.daily.precipitation_hours[days] == 0) {
    console.log("You will not need your galoshes ")
} else {
    console.log("You might need your galoshes ")
}

if(days == 0) {
    console.log("today.")
} else if(days > 1) {
    console.log("in " + days + " days.")
} else {
    console.log("tomorrow.")
}


