 Banco de Dados


CREATE TABLE Usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('admin', 'funcionario'))
);

CREATE TABLE Token (
    id_token INT IDENTITY(1,1) PRIMARY KEY,
    valor_token VARCHAR(MAX) NOT NULL,
    data_expiracao DATETIME NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE PedidoStatus (
    id_PedidoStatus INT IDENTITY(1,1) PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Pedidos (
    id_pedido INT IDENTITY(1,1) PRIMARY KEY,
    data_pedido DATETIME DEFAULT GETDATE(),
    id_PedidoStatus INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_status) REFERENCES PedidoStatus(id_Pedidotatus),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Itens (
    id_item INT IDENTITY(1,1) PRIMARY KEY,
    quantidade INT NOT NULL,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto)
);
