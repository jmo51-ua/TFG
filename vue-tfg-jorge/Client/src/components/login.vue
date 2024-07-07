<template>
    <div class="form-container">
        <div class="form">
            <div class="title">Bienvenido,<br><span>Inicia sesión para continuar</span></div>
            <input v-model="email" class="input" name="email" placeholder="Email" type="email">
            <input v-model="password" class="input" name="password" placeholder="Password" type="password">
            <button @click="login" class="button-confirm">Iniciar sesión</button>
        </div>
    </div>
</template>

<script>
  import { inject, ref } from 'vue';
  import { useStore } from 'vuex';
  import Swal from 'sweetalert2';

  export default {
    setup() {
        const app = inject('app');
        const dao = inject('dao');
        const store = useStore();

        const email = ref("");
        const password = ref("");

        const login = () => {
            app.login({ email: email.value, password: password.value }).then(
                () => {
                    dao.user.read().then((response) => {
                        let usuario = response.filter(user =>
                            user.email == email.value &&
                            user.password == password.value
                        )[0];

                        if(usuario){
                            store.dispatch('actualizarLogged', true);
                            store.dispatch('actualizarUserID', usuario.id);
                            store.dispatch('actualizarUserName', usuario.nick);
                        }
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Usuario no encontrado',
                            });
                        }
                    }).catch((error) => {
                        console.error('Error leyendo los usuarios:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error leyendo los usuarios',
                        });
                    });
                },
                () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error en el login',
                    });
                }
            );
        };

        return {
            email,
            password,
            login,
        };
    },
  };
</script>

<style>

    .form-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
    }
    .form {
        --input-focus: #2d8cf0;
        --font-color: #fefefe;
        --font-color-sub: #7e7e7e;
        --bg-color: #111;
        --main-color: #acc9ff;
        padding: 20px;
        background: var(--bg-color);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 20px;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        box-shadow: 4px 4px var(--main-color);
    }

    .title {
        color: var(--font-color);
        font-weight: 900;
        font-size: 20px;
        margin-bottom: 25px;
    }

    .title span {
        color: var(--font-color-sub);
        font-weight: 600;
        font-size: 17px;
    }

    .input {
        width: 250px;
        height: 40px;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        background-color: var(--bg-color);
        box-shadow: 4px 4px var(--main-color);
        font-size: 15px;
        font-weight: 600;
        color: var(--font-color);
        padding: 5px 10px;
        outline: none;
    }

    .input::placeholder {
        color: var(--font-color-sub);
        opacity: 0.8;
    }

    .input:focus {
        border: 2px solid var(--input-focus);
    }

    .login-with {
        display: flex;
        gap: 20px;
    }

    .button-log {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 100%;
        border: 2px solid var(--main-color);
        background-color: var(--bg-color);
        box-shadow: 4px 4px var(--main-color);
        color: var(--font-color);
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .icon {
        width: 24px;
        height: 24px;
        fill: var(--main-color);
    }

    .button-log:active, .button-confirm:active {
        box-shadow: 0px 0px var(--main-color);
        transform: translate(3px, 3px);
    }

    .button-confirm {
        margin: 50px auto 0 auto;
        width: 120px;
        height: 40px;
        border-radius: 5px;
        border: 2px solid var(--main-color);
        background-color: var(--bg-color);
        box-shadow: 4px 4px var(--main-color);
        font-size: 17px;
        font-weight: 600;
        color: var(--font-color);
        cursor: pointer;
    }


</style>