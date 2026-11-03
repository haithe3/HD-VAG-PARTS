CREATE TABLE `compatibility_rows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(255) NOT NULL,
	`partName` text NOT NULL,
	`brand` varchar(120),
	`compatibleModels` text,
	`years` varchar(120),
	`engineCodes` varchar(255),
	`price` varchar(64),
	`quality` varchar(40),
	`inStock` boolean NOT NULL DEFAULT true,
	`placeholder` boolean NOT NULL DEFAULT false,
	CONSTRAINT `compatibility_rows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `delivery_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wilaya` varchar(120) NOT NULL,
	`price` varchar(64),
	`delay` varchar(120),
	CONSTRAINT `delivery_zones_id` PRIMARY KEY(`id`),
	CONSTRAINT `delivery_zones_wilaya_unique` UNIQUE(`wilaya`)
);
--> statement-breakpoint
CREATE TABLE `maintenance_packs` (
	`id` varchar(64) NOT NULL,
	`name` varchar(180) NOT NULL,
	`vehicle` varchar(255),
	`items` text NOT NULL,
	`price` varchar(64),
	`image` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_packs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(64) NOT NULL,
	`storageKey` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`altText` varchar(255),
	`uploadedByOpenId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`reference` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL,
	`brand` varchar(120),
	`quality` varchar(40),
	`compatible` text,
	`price` varchar(64),
	`priceValue` int,
	`inStock` boolean NOT NULL DEFAULT true,
	`image` text,
	`keywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
