import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';

import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
