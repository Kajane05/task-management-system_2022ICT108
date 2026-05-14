import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  const task = new Task(req.body);
  const saved = await task.save();
  res.status(201).json(saved);
};

export const getTask = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
