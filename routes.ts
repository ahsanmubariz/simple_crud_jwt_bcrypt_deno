import { Router } from "https://deno.land/x/oak/mod.ts";
import auth from './auth.ts';
import {
    addStudent,
    getStudentsById,
    getAllStudents,
    updateStudent,
    deleteStudent,
    login,
} from "./controller.ts";

const router = new Router(); // Create Router

router
  .get("/student", auth, getAllStudents) 
  .get("/student/:studentID",auth, getStudentsById)
  .post("/student", auth,addStudent)
  .post("/student/login", login)
  .put("/student/:studentID", auth,updateStudent)
  .delete("/student/:studentID", auth,deleteStudent); 

export default router;