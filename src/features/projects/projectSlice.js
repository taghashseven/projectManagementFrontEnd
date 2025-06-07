// features/projects/projectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../../utils/api";

// Async Thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const data = await apiFetch("http://localhost:3000/projects");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, thunkAPI) => {
    try {
      const data = await apiFetch("http://localhost:3000/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// get team members
export const fetchAllUsers = createAsyncThunk(
  "projects/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const data = await apiFetch("http://localhost:3000/auth/getUsers");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, projectData }, thunkAPI) => {
    try {
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify(projectData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      await apiFetch(`http://localhost:3000/projects/${projectId}`, {
        method: "DELETE",
      });
      return projectId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Task-related async thunks
export const addOrUpdateTask = createAsyncThunk(
  "projects/addOrUpdateTask",
  async ({ projectId, taskData }, thunkAPI) => {
    console.log(taskData  , "add or update Task -----------------");
    try {
      console.log(projectId  , "add or update Task ");
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}/tasks`,
        {
          method: "PUT",
          body: JSON.stringify(taskData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { projectId, tasks: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "projects/deleteTask",
  async ({ projectId, taskId }, thunkAPI) => {
    try {
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
      return { projectId, tasks: data.tasks };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  currentProject: null,
  loading: false,
  error: null,
  allUsers: [],
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload; // Store all users
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add/Update Task
      .addCase(addOrUpdateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateTask.fulfilled, (state, action) => {
        const { projectId, tasks } = action.payload;

        // Update in items array
        const projectIndex = state.items.findIndex((p) => p._id === projectId);
        if (projectIndex !== -1) {
          state.items[projectIndex].tasks = tasks;
        }

        // Update in currentProject if it's the same project
        if (state.currentProject?._id === projectId) {
          state.currentProject.tasks = tasks;
        }

        state.loading = false;
      })
      .addCase(addOrUpdateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { projectId, tasks } = action.payload;

        // Update in items array
        const projectIndex = state.items.findIndex((p) => p._id === projectId);
        if (projectIndex !== -1) {
          state.items[projectIndex].tasks = tasks;
        }

        // Update in currentProject if it's the same project
        if (state.currentProject?._id === projectId) {
          state.currentProject.tasks = tasks;
        }

        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const addTeamMember = createAsyncThunk(
  "projects/addTeamMember",
  async ({ projectId, memberData }, thunkAPI) => {
    try {
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}/team`,
        {
          method: "POST",
          body: JSON.stringify(memberData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { projectId, updatedProject: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  "projects/updateTeamMember",
  async ({ projectId, memberId, memberData }, thunkAPI) => {
    try {
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}/team/${memberId}`,
        {
          method: "PUT",
          body: JSON.stringify(memberData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { projectId, updatedProject: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeTeamMember = createAsyncThunk(
  "projects/removeTeamMember",
  async ({ projectId, memberId }, thunkAPI) => {
    try {
      const data = await apiFetch(
        `http://localhost:3000/projects/${projectId}/team/${memberId}`,
        {
          method: "DELETE",
        }
      );
      return { projectId, updatedProject: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Selectors
export const selectProjects = (state) => state.projects.items;
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectLoading = (state) => state.projects.loading;
export const selectProjectError = (state) => state.projects.error;

// Actions
export const { setCurrentProject, clearCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
