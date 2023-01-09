const App = new Vue({
    el: "#app",
    data() {
        return {
            user: '',
            text: '',
            messages: [],
            ws: null,
            connectionStatus: null
        }
    },
    created() {
        const getUser = prompt('Please enter your username to join at chat group.');

        if (getUser === null) {
            alert('You must enter your username!');
            window.location.reload();
        }

        this.user = getUser;
        this.connect();
    },
    methods: {
        connect(onOpen) {
            this.ws = new WebSocket('ws://localhost:9001');

            this.ws.onopen = () => {
                this.connectionStatus = `Connected`;

                if (onOpen) {
                    onOpen();
                }
            }

            this.ws.onerror = () => {
                this.connectionStatus = 'Could not connect to the server';
                return;
            }

            this.ws.onmessage = (message) => {
                let data = JSON.parse(message.data);
                this.addMessage(data);
            }
        },
        addMessage(data) {
            this.messages.push(data);
            this.scrollDown();
        },
        sendMessage() {
            if (this.text.trim() === '' || !this.user) {
                return;
            }

            if (this.ws.readyState !== this.ws.OPEN) {
                this.connectionStatus = 'Try again later';
                return;
            }

            this.ws.send(
                JSON.stringify({
                    user: this.user,
                    text: this.text,
                })
            );

            this.text = '';
        },
        scrollDown() {
            const container = this.$el.querySelector('#conversation');
            container.scrollTop = container.scrollHeight;
        }
    }
})