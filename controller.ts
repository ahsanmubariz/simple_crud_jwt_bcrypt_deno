import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.28.1/mod.ts";
import { StudentSchema } from "./schema.ts";
import { create,getNumericDate } from "https://deno.land/x/djwt@v2.4/mod.ts";
  import key from './key.ts';


import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// jwt key
const local_db = new MongoClient();
const user = "";
const pass = "";
const db_mongo = "students";
// Connecting to a Local Database
try {
  await local_db.connect("mongodb://127.0.0.1:27017");
} catch (err) {
  console.log(err);
}

const db = local_db.database("students");
const students = db.collection<StudentSchema>("students");

// get all students
const getAllStudents = async ({ response }: { response: any }) => {
  try {
    const getAll = await students.find({}).toArray();
    if (getAll) {
      response.status = 200;
      response.body = {
        success: true,
        data: getAll,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        message: "error in server",
      };
    }
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};

// get students by id
const getStudentsById = async ({
  params,
  response,
}: {
  params: {
    studentID: string;
  };
  response: any;
}) => {
  try {
    const getOne = await students.findOne({ studentID: params.studentID });
    if (getOne) {
      response.status = 200;
      response.body = {
        success: true,
        data: getOne,
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        data: null,
        message: "no data found",
      };
    }
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};
// add student
const addStudent = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "no data detected on request body",
      };
    } else {
      const body = await request.body();
      const body_data = await body.value;
      const salt = await bcrypt.genSalt(8);
      const hash: string = await bcrypt.hash(body_data.password, salt);

      const save_variable = {
        name: await body_data.name,
        password: hash,
        studentID: await body_data.studentID,
        grade: await body_data.grade,
      };

      await students.insertOne(save_variable);

      response.status = 201;
      response.body = {
        success: true,
        data: save_variable,
      };
    }
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};
const login = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    const req_body = await request.body().value;
    const getOne = await students.findOne({
      studentID: req_body.studentID,
    });
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        message: "no data detected on request body",
      };
    } else {
      if (getOne) {

        const validatePassword = await bcrypt.compare(
          req_body.password,
          getOne.password,
        );
        if (!validatePassword) {
          response.status = 401;
          response.body = {
            success: false,
            message: "credential not valid",
          };
        } else {
          const jwt = await create({ alg: "HS512", typ: "JWT" }, { exp: getNumericDate(60 * 60) }, key);

          response.status = 200;
          response.body = {
            success: true,
            message: "password valid",
            data: getOne,
            token : jwt
          };
        }
      } else {
        response.status = 404;
        response.body = {
          success: false,
          message: "user not found",
        };
      }
    }
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};
// update student
const updateStudent = async ({
  params,
  request,
  response,
}: {
  params: { studentID: string };
  request: any;
  response: any;
}) => {
  try {
    const body = await request.body().value;
    await students.updateOne(
      {
        studentID: params.studentID,
      },
      {
        $set: {
          name: body.name,
          grade: body.grade,
        },
      },
    );
    const updatedData = await students.findOne({
      studentID: params.studentID,
    });
    response.body = {
      success: true,
      data: updatedData,
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};

// delete student
const deleteStudent = async ({
  params,
  request,
  response,
}: {
  params: { studentID: string };
  request: any;
  response: any;
}) => {
  try {
    await students.deleteOne({
      studentID: params.studentID,
    });
    response.status = 200;
    response.body = {
      success: true,
      message: "student deleted",
    };
  } catch (error) {
    response.body = {
      success: false,
      message: error.toString(),
    };
  }
};

export {
  addStudent,
  deleteStudent,
  login,
  getAllStudents,
  getStudentsById,
  updateStudent,
};
