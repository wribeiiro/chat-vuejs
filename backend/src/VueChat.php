<?php

namespace Wribeiiro;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use \SplObjectStorage;

class VueChat implements MessageComponentInterface
{
    protected SplObjectStorage $clients;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();

        echo "Server Started.";
    }

    /**
     * When a connection was established
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "Client connected ({$conn->resourceId})" . PHP_EOL;
    }

    /**
     * When a message was sended
     *
     * @param ConnectionInterface $from
     * @param array data
     * @return void
     */
    public function onMessage(ConnectionInterface $from, $data)
    {

        $data = json_decode($data);
        $data->date = date('d/m/Y H:i:s');
        $data->resourceId = $from->resourceId;

        foreach ($this->clients as $client) {
            $client->send(json_encode($data));
        }

        echo "Client {$from->resourceId} send a message" . PHP_EOL;
    }

    /**
     * When connection close
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn)
    {

        $this->clients->detach($conn);
        echo "Client {$conn->resourceId} desconected" . PHP_EOL;
    }

    /**
     * When an error exists
     *
     * @param ConnectionInterface $conn
     * @param \Exception $error
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $error)
    {

        $conn->close();
        echo "Error: {$error->getMessage()}" . PHP_EOL;
    }
}
