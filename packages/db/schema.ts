import { pgTable as table, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const UserTable = table('users',{}) 