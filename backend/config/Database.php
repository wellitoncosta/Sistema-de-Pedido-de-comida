<?php
header("Content-Type: application/json");

require_once "../config/database.php";

$database = new Database();

$conn = $database->connect();

$data = json_decode(
    file_get_contents("php://input"),
    true
);
class Database {

    private $host = "localhost";
    private $db_name = "food_order_db";
    private $username = "root";
    private $password = "";
    private $port = "3307";

    public $conn;

    public function connect() {

        $this->conn = null;

        try {

            $this->conn = new PDO(
                "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password
            );

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $e) {

            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }

        return $this->conn;
    }
}
?>