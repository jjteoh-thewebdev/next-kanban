# Project Overview using the RADIO Framework

## Background

Goal: Create a kanban board, something similar to Trello, Github Project, Notion board.

This document provides a structured overview of the project using the RADIO framework, focusing on requirements, architecture, data model, interfaces, and optimizations. 

## Requirements Exploration

- **Main Use Cases**: 
  - Manage tasks using a Kanban board interface
  - Add, edit, and delete tasks
  - Assign tasks to assignees
  - Organize tasks into columns
  
- **Functional Requirements**:
  - Users can create, edit, and delete tasks
  - Tasks can be moved between columns
  - Users can assign tasks to themselves or others
  - Board appearance can be customized with colors and images

- **Non-functional Requirements**:
  - Responsive design for mobile and desktop
  - Fast loading times
  - Intuitive user interface

- **Out of Scope**:
  - Account management (login, signup and etc.)
  - Board ownership & misc (since account management is not part of project, things like board ownership, multiple boards are excluded).

## Architecture / High-level Design

**Objective**: Identify the key components of the product and how they are related to each other.

- **Components**:
  - **Board**: Manages columns and overall board settings(background appearance)
  - **Column**: Contains tasks and manages task order
  - **Task/Card**: Represents individual task with details like title, description, assignees, checklists and etc.
  - **Card Drawer**: Contains specific task details. Support view mode and edit mode.

- **Interactions**:
  - Drag and drop tasks between columns
  - Edit task details in a modal or drawer
  - Customize board settings through a settings panel

## Data Model / Core Entities

**Objective**: Describe the core entities and their data.

- **Entities**:
  - **Board**: id, title, background color/image
  - **Column**: id, title, order, tasks
  - **Task/Card**: id, title, description, assignees, tags, priority, due date, checklist, image
  - **Assignee**: id, name, avatar

## Interface Definition (API)

**Objective**: Define the interface (API) between components in the product.

- **APIs**:
  - **Task Management**: Create, update, delete tasks
  - **Column Management**: Add, rename, delete columns
  - **Board Customization**: Update board settings

## Optimizations and Deep Dive

**Objective**: Discuss possible optimization opportunities and specific areas of interest when building the product.

- **Performance**: Optimize drag-and-drop interactions for smoothness
- **User Experience**: Ensure intuitive navigation and task management
- **Accessibility**: Implement keyboard navigation and screen reader support
- **Scalability**: Design for large boards with many tasks and columns

