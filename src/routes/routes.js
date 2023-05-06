import { randomUUID } from "crypto";
import { Database } from '../database/database.js';
import { buildRoutePath } from "../utils/build-route-path.js";

const db = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const searchParams = search ? {
        title: search,
        description: search
      } : null

      const tasks = db.select('tasks', searchParams)

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      console.log(req.body)

      if (!title || !description) {
        return res.writeHead(400).end('404 Not Found');
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      }

      db.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(task));
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      db.delete('tasks', id)

      res.writeHead(204).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const rowChanged = db.update('tasks', id, { title, description })

      if (!rowChanged) {
        res.writeHead(404).end("Task not found")
        return;
      }


      res.writeHead(200).end(JSON.stringify(rowChanged))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const rowChanged = db.update('tasks', id, { title: null, description: null, completed_at: new Date() })

      if (!rowChanged) {
        res.writeHead(404).end("Task not found")
        return;
      }

      res.writeHead(200).end(JSON.stringify(rowChanged))
    }
  }
]