/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
import { list } from '@keystone-6/core';

// We're using some common fields in the starter. Check out https://keystonejs.com/docs/apis/fields#fields-api
// for the full list of fields.
import {
    text,
    relationship,
    password,
    timestamp,
    select,
    file,
    json,
    integer,
    virtual,
} from '@keystone-6/core/fields';
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { document } from '@keystone-6/fields-document';

// We are using Typescript, and we want our types experience to be as strict as it can be.
// By providing the Keystone generated `Lists` type to our lists object, we refine
// our types to a stricter subset that is type-aware of other lists in our schema
// that Typescript cannot easily infer.
import { Lists } from '.keystone/types';
import { graphql } from '@graphql-ts/schema';

import mime from 'mime-types';

const isAdmin = ({ session }: { session: Session }) => session?.data != null;

export const lists: Lists = {
    // Here we define the user list.
    User: list({
        // Here are the fields that `User` will have. We want an email and password so they can log in
        // a name so we can refer to them, and a way to connect users to posts.
        fields: {
            username: text({
                validation: { isRequired: true }, 
                isIndexed: 'unique',
                isFilterable: true
            }),
            email: text({
                validation: { isRequired: true },
                isIndexed: 'unique',
                isFilterable: true,
            }),
            // The password field takes care of hiding details and hashing values
            password: password({ validation: { isRequired: true } }),
        },
        // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
        ui: {
            labelField: 'username',
            listView: {
                initialColumns: ['username', 'email'],
            },
        },
    }),
    FormSubmission: list({
        access: {
            operation: {
                update: isAdmin,
                delete: isAdmin,
                query: isAdmin
            },
        },
        fields: {
            email: text({
                isIndexed: 'unique',
                validation: {
                    isRequired: true,
                    match: {
                        regex: /\w*@\w*.\w{2,6}/i,
                        explanation: "Provide a valid email address."
                    }
                }
            })
        }
    }),
    Project: list({
        fields: {
            userid: relationship({
                ref: 'User'
            }),
            name: text(),
            trackItems: relationship({
                ref: 'TrackItem.project',
                many: true
            }),
            track: json()
        },
        access: {
            filter: {
                query: ({ session }) => {
                    return { userid: {id: {equals: session.itemId} } }
                },
                update: ({ session }) => {
                    return { userid: { id: { equals: session.itemId } } }
                },
                delete: ({ session }) => {
                    return { userid: { id: { equals: session.itemId } } }
                }
            }
        }
    }),
    TrackItem: list({
        fields: {
            name: text(),
            project: relationship({
                ref: 'Project.trackItems',
                many: false
            }),
            duration: integer(),
            file: relationship({
                ref: 'File'
            }),
            data: json(),
            type: select({
                validation: {
                    isRequired: true
                },
                options: ['video', 'image'],
                defaultValue: 'video'
            })
        }
    }),
    File: list({
        fields: {
            userid: relationship({
                ref: 'User'
            }),
            file: file(),
            type: virtual({
                field: graphql.field({
                    type: graphql.String,
                    resolve: (item) => {
                        return mime.lookup(item.file_filename)||null;
                    }
                })
            })
        },
        access: {
            filter: {
                query: ({ session }) => {
                    return { userid: { id: { equals: session.itemId } } }
                },
                update: ({ session }) => {
                    return { userid: { id: { equals: session.itemId } } }
                },
                delete: ({ session }) => {
                    return { userid: { id: { equals: session.itemId } } }
                }
            }
        }
    })
};
