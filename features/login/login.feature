Feature: Inicio de sesión
    Como usuario registrado
    Quiero iniciar sesión en la plataforma
    Para acceder a mi cuenta

    Background:
        Given que el usuario se encuentra en la página "/login"

    Scenario: Inicio de sesión exitoso con credenciales válidas
        Given que existe un usuario registrado con correo "user-<timestamp>@example.com" y contraseña "Test1234!"
        When el usuario completa el campo "email" con "user-<timestamp>@example.com"
        And el usuario completa el campo "password" con "Test1234!"
        And el usuario presiona el botón "login-submit"
        Then el usuario es redirigido a la página principal "/"
        And el elemento "nav-user" muestra el correo "user-<timestamp>@example.com"
        And el elemento "nav-logout" es visible

    Scenario Outline: Intento de inicio de sesión con credenciales inválidas
        When el usuario completa el campo "email" con "<email>"
        And el usuario completa el campo "password" con "<password>"
        And el usuario presiona el botón "login-submit"
        Then el sistema muestra el mensaje de error "<mensajeError>" en el elemento "login-error"
        And el usuario permanece en la página "/login"

        Examples:
            | email                | password       | mensajeError                           |
            | usuario@example.com  | ContraseñaMala | "Correo o contraseña incorrectos"      |
            | noexiste@example.com | Test1234!      | "Correo o contraseña incorrectos"      |
            |                      | Test1234!      | "El correo electrónico es obligatorio" |
            | usuario@example.com  |                | "La contraseña es obligatoria"         |

    Scenario: Cierre de sesión y nuevo inicio de sesión
        Given que el usuario inició sesión correctamente
        When el usuario presiona el botón "nav-logout"
        Then el elemento "nav-login" es visible
        And el elemento "nav-register" es visible
        And el elemento "nav-user" no existe
        When el usuario vuelve a iniciar sesión con las mismas credenciales
        Then el usuario es redirigido a la página principal "/"
        And el elemento "nav-user" muestra el correo ingresado
