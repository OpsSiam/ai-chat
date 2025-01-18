CREATE TABLE [Session] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [title] NVARCHAR(MAX) NULL,
    [createdAt] DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE [Message] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [sessionId] INT NOT NULL,
    [role] NVARCHAR(MAX) NOT NULL,
    [content] NVARCHAR(MAX) NOT NULL,
    [createdAt] DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Message_Session FOREIGN KEY ([sessionId]) REFERENCES [Session]([id]) ON DELETE CASCADE
);
