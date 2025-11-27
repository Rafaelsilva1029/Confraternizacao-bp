CREATE TABLE `despesas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`item` varchar(255) NOT NULL,
	`valor` int NOT NULL,
	`data_compra` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `despesas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funcionarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`valor_contribuicao` int NOT NULL,
	`status` enum('Pago','Pendente','Aguardando Alvará') NOT NULL DEFAULT 'Pendente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `funcionarios_id` PRIMARY KEY(`id`)
);
