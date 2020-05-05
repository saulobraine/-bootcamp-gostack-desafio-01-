const express = require('express');

const server = express();

server.use(express.json());

const projects = [{
    id: 1,
    title: "Projeto Default",
    tasks: [
        "Retornar todos os projetos com tasks",
        "Retornar projeto específico",
        "Cadastrar projeto",
        "Editar projeto",
        "Deletar projeto",
        "Retornar tasks específicas de projeto",
        "Cadastrar task",
        "Editar task",
        "Deletar task"
    ]
}];


// MIDDLEWARES

server.use((req, res, next) => {
    console.time("Request");

    // Contagem de quantas requisições foram feitas
    console.count("Requests");

    next();
    console.timeEnd("Request");
})

// Verificar se projeto existe
const checkProjectExist = (req, res, next) => {

    const project = projects.find(item => item.id == req.params.id);
    const projectIndex = projects.findIndex(item => item.id == req.params.id);

    if (!project) {
        return res.status(400).json({ error: "This project does not exist" });
    }

    req.project = project;
    req.projectIndex = projectIndex;

    next();
}

// Verificar se task existe
const checkTaskExist = (req, res, next) => {
    const { index } = req.params;
    const task = projects[req.projectIndex].tasks[index];

    if (!task) {
        return res.status(400).json({ error: "This task does not exist" });
    }

    next();
}


// PROJECTS

// Retornar todos os projects
server.get("/projects", (req, res) => {
    return res.json(projects)
});

// Retornar projeto específico
server.get("/projects/:id", checkProjectExist, (req, res) => {
    return res.json(req.project);
});

// Cadastra projeto
server.post("/projects", (req, res) => {
    const { id, title } = req.body;
    const tasks = [];

    projects.push({ id, title, tasks });

    return res.json(projects);
});

// Modifica projeto
server.put("/projects/:id", checkProjectExist, (req, res) => {
    const { title } = req.body;

    projects[req.projectIndex] = {...projects[req.projectIndex], title }

    return res.json(projects[req.projectIndex]);
});

// Deleta projeto
server.delete("/projects/:id", checkProjectExist, (req, res) => {
    projects.splice(req.projectIndex, 1);

    return res.json(projects);
});

// TASKS

// Retornar tasks específicas
server.get("/projects/:id/tasks", checkProjectExist, (req, res) => {
    return res.json(req.project.tasks);
});

// Cadastrar task
server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {

    const { title } = req.body;
    projects[req.projectIndex].tasks.push(title);

    return res.json(req.project);
});

// Editar task
server.put("/projects/:id/tasks/:index", checkProjectExist, checkTaskExist, (req, res) => {
    const { title } = req.body;
    const { index } = req.params;

    projects[req.projectIndex].tasks[index] = title;

    return res.json(projects[req.projectIndex]);
});

// Deletar task
server.delete("/projects/:id/tasks/:index", checkProjectExist, checkTaskExist, (req, res) => {
    const { index } = req.params;

    projects[req.projectIndex].tasks.splice(index, 1);

    return res.json(projects[req.projectIndex]);
});

server.listen(3000);