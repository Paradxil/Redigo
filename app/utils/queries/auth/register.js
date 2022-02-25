import gpl from 'graphql-tag';

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