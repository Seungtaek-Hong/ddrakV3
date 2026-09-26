import gql from 'graphql-tag'
import { USER_FRAGMENT } from '@client/shared/queries'

export const USER_QUERY = gql`
  query ($id: Int!) {
    user(id: $id) {
      ${USER_FRAGMENT}
    }
  }
`

export const USERS_QUERY = gql`
  query {
    users {
      ${USER_FRAGMENT}
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation ($id: Int!, $name: String, $password: String) {
    updateUser(id: $id, name: $name, password: $password) {
      ${USER_FRAGMENT}
    }
  }
`