import { gpl } from '@apollo/client';

export default gpl`
    mutation registerUser($username:String, $email:String, $password:String) {
        createUser(data: {username: $username, email: $email, password: $password}) {
            id
            username
            email
            password {
                isSet
            }
        }
    }
`