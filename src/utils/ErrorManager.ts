
export enum FlexPluginErrorType {
    action = "ActionFramework",
    serverless = "Serverless",
    programabelComponents = "ProgramableComponents"    
}

/**
 * FlexPluginError severity
 *
 * @category Flex Errors
 * @ignore
 * @enum {"user" | "normal" | "severe" } FlexErrorSeverity
 * @property {"user"} user - Errors originating from denial to user request, not actual error
 * @property {"normal"} normal - Normal error condition
 * @property {"severe"} severe - Severe error condition (some system hard down)
 * @memberof FlexPluginError
 */
export enum FlexErrorSeverity {
    normal = "normal",
    severe = "severe"
}


export type FlexPluginErrorContents = {
    type?: FlexPluginErrorType | string;
    wrappedError?: Error | string | unknown;
    context?: string;
    description?: string;
    severity?: FlexErrorSeverity;
};

export class FlexPluginError extends Error {
    /**
     * Flex content
     *
     * @type {FlexPluginErrorContents}
     */
    public content: FlexPluginErrorContents & {
        type: FlexPluginErrorType | string;
        severity: FlexErrorSeverity;
    };

    /**
     * Date when the error has been triggered
     *
     * @type {Date}
     */
    public time: Date;

    /**
     * Timestamp related with the latest relevant log
     *
     * @type {string | undefined}
     */
    public logManagerTimestamp: string | undefined;

    constructor(message: string, content: FlexPluginErrorContents = {}) {
        super(message);
        this.content = {
            ...content,
            type: content.type || "CallbackAndVoicemail",
            severity: content.severity || FlexErrorSeverity.normal,
        };
        this.time = new Date();
        Object.setPrototypeOf(this, FlexPluginError.prototype);
    }

    /**
     * Represents log line
     *
     * @type {string}
     */
    public get logLine(): string {
        const { description, context, wrappedError } = this.content;
        const message = description || this.message;
        let wrappedErrorDescription = "";

        if (wrappedError) {
            if (wrappedError instanceof Error && wrappedError.message) {
                wrappedErrorDescription = `\n\nOriginal error:\n"${wrappedError.message}"`;
            } else if (typeof wrappedError === "string") {
                wrappedErrorDescription = `\n\nOriginal error:\n"${wrappedError}"`;
            }
        }
        const contextString = !!context ? `- ${context}` : "";

        return `${this.time.toLocaleString()} ${contextString}: ${message}${wrappedErrorDescription}`;
    }
}


class ErrorManagerImpl {

    public processError(error: FlexPluginError): FlexPluginError {
        try {
            // log.error(error.logLine);
            // Add telemetry code here
        } catch (e) {
            // Do not throw, let's avoid Inceptions
        }

        return error;
    }

    public createAndProcessError(message: string, content: FlexPluginErrorContents = {}): FlexPluginError {
        const error = new FlexPluginError(message, content);
        return this.processError(error);
    }
}

/**
 * @class ErrorManager
 * @hideconstructor
 * @category Flex Plugin Errors
 */
export const ErrorManager = new ErrorManagerImpl();