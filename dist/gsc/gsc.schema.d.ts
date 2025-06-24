import { Document } from 'mongoose';
export declare class GscToken extends Document {
    email: string;
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    selectedSite?: string;
}
export declare const GscTokenSchema: import("mongoose").Schema<GscToken, import("mongoose").Model<GscToken, any, any, any, Document<unknown, any, GscToken, any> & GscToken & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GscToken, Document<unknown, {}, import("mongoose").FlatRecord<GscToken>, {}> & import("mongoose").FlatRecord<GscToken> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
