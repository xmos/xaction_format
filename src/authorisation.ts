/*
* Contains helper functions to determine if a commenter is authorised to run commands
* */

import {context} from '@actions/github';

export enum commentAuthorAssoc {
    COLLABORATOR = 'COLLABORATOR',
    CONTRIBUTOR = 'CONTRIBUTOR',
    FIRST_TIMER = 'FIRST_TIMER',
    FIRST_TIME_CONTRIBUTOR = 'FIRST_TIME_CONTRIBUTOR',
    MANNEQUIN = 'MANNEQUIN',
    MEMBER = 'MEMBER',
    NONE = 'NONE',
    OWNER = 'OWNER',
}

// returns one of the associations from the string in the context
export function getCommentAuthorAssoc(
    comment: {[key: string]: any; id: number} | undefined
): commentAuthorAssoc {
    if (comment === undefined)
        throw new Error('context.payload.comment is undefined.');

    let assoc: commentAuthorAssoc;

    const author_association = comment.author_association;

    switch (author_association) {
        case 'COLLABORATOR':
            assoc = commentAuthorAssoc.COLLABORATOR;
            break;
        case 'CONTRIBUTOR':
            assoc = commentAuthorAssoc.CONTRIBUTOR;
            break;
        case 'FIRST_TIMER':
            assoc = commentAuthorAssoc.FIRST_TIMER;
            break;
        case 'FIRST_TIME_CONTRIBUTOR':
            assoc = commentAuthorAssoc.FIRST_TIME_CONTRIBUTOR;
            break;
        case 'MANNEQUIN':
            assoc = commentAuthorAssoc.MANNEQUIN;
            break;
        case 'MEMBER':
            assoc = commentAuthorAssoc.MEMBER;
            break;
        case 'NONE':
            assoc = commentAuthorAssoc.NONE;
            break;
        case 'OWNER':
            assoc = commentAuthorAssoc.OWNER;
            break;
        default:
            throw new Error(`Unrecognised user association: ${author_association}`);
    }
    return assoc;
}

