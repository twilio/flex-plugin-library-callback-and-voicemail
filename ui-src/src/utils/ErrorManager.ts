export enum FlexPluginErrorType {
    action = "ActionFramework",
    serverless = "Serverless",
    programabelComponents = "ProgramableComponents"    
}

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

    public content: FlexPluginErrorContents & {
        type: FlexPluginErrorType | string;
        severity: FlexErrorSeverity;
    };

    public time: Date;

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
}

class ErrorManagerImpl {

    public processError(error: FlexPluginError): FlexPluginError {
        try {
            console.log(`Callback and Voicemail Plugin: ${error}\nType: ${error.content.type}\nContext:${error.content.context}`);
            // const flexManager = window?.Twilio?.Flex?.Manager?.getInstance();
            // flexManager.reportPluginInteraction({
            //     name: 'CALLBACK_VOICEMAIL_PLUGIN_ERROR',
            //     status: 'COMPLETE',
            //     details: {
            //         error: error
            //     }
            // });
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

export const ErrorManager = new ErrorManagerImpl();