import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkspace = mutation({
    args:{
        messages: v.any(),
        user: v.id('users'),
    },
    handler: async(ctx, args) => {
        const workspaceId = await ctx.db.insert('workspace',{
            messages: args.messages,
            user: args.user,
        });
        return workspaceId;
    }
})

export const GetWorkspace = query({
    args: { 
        workSpaceId: v.id('workspace')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.workSpaceId);
        return result;
    }
});