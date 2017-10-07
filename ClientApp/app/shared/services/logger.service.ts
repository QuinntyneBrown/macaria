﻿import { Injectable, Inject } from "@angular/core";
import { constants } from "../constants";

export interface ILogger {
    log(logLevel: LogLevel, message: string): void;
}

export enum LogLevel {
    Trace = 0,
    Information,
    Warning,
    Error,
    None
}

@Injectable()
export class Logger implements ILogger {
    constructor( @Inject(constants.MINIMUM_LOG_LEVEL) private _minimumLogLevel: LogLevel) { }

    public log(logLevel: LogLevel, message: string) {
        if (logLevel >= this._minimumLogLevel)
            console.log(`${LogLevel[logLevel]}: ${message}`);        
    }

    public trace(message: string) { this.log(LogLevel.Trace, message); }
}
