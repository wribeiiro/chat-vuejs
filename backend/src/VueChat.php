<?php

namespace Chat;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class VueChat implements MessageComponentInterface {
    
    /** @var SplObjectStorage  */
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;

        echo "Server Started.";
    }
   
    /**
     * Undocumented function
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
     * Undocumented function
     *
     * @param ConnectionInterface $from
     * @param [type] $data
     * @return void
     */
    public function onMessage(ConnectionInterface $from, $data) {

        $data = json_decode($data);
        $data->date = date('d/m/Y H:i:s');

        foreach ($this->clients as $client) {
            $client->send(json_encode($data));
        }

        echo "Client {$from->resourceId} send a message" . PHP_EOL;
    }
    
    /**
     * Undocumented function
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn) {
        
        $this->clients->detach($conn);
        echo "Client {$conn->resourceId} desconected" . PHP_EOL;
    }
    
    /**
     * Undocumented function
     *
     * @param ConnectionInterface $conn
     * @param \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $e) {

        $conn->close();
        echo "Error: {$e->getMessage()}" . PHP_EOL;
    }
}