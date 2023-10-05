import { gql } from '@apollo/client';

export const ADD_USER = gql`
mutation addUser($username: String!, $email:String!, $password: String!) {
    addUser($username: String!, $email:String!, $password: String!) {
        token
        user
    }
}`