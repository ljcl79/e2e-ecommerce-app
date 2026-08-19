Feature: Registro de usuario
    Como usuario nuevo
    Quiero registrarme en la plataforma
    Para poder acceder con mi cuenta

    Background:
        Given que el usuario se encuentra en la página "/register"

    Scenario: Registro exitoso con datos válidos
        When el usuario completa el campo "email" con un correo único
        And el usuario completa el campo "password" con "Test1234!"
        And el usuario presiona el botón "register-submit"
        Then el usuario es redirigido a la página principal "/"
        And el elemento "nav-user" muestra el correo ingresado
        And el elemento "nav-logout" es visible

    Scenario Outline: Intento de registro con datos inválidos
        When el usuario completa el campo "email" con "<email>"
        And el usuario completa el campo "password" con "<password>"
        And el usuario presiona el botón "register-submit"
        Then el sistema muestra el mensaje de error "<mensajeError>" en el elemento "register-error"
        And el usuario permanece en la página "/register"

        Examples:
            | email               | password  | mensajeError                                     |
            | correo-invalido     | Test1234! | "El correo electrónico no es válido"             |
            |                     | Test1234! | "El correo electrónico es obligatorio"           |
            | usuario@example.com |           | "La contraseña es obligatoria"                   |
            | usuario@example.com | 123       | "La contraseña debe tener al menos 8 caracteres" |
            | usuario@example.com | Test1234! | "El correo electrónico ya está registrado"       |
