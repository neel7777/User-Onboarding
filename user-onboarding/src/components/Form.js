import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
// props from Formik => values, errors, touched, status
// these are prefixed props sent from Formik into AnimalForm because AnimalForm is wrapped by withFormik HOC
// values => state of inputs & updates with change in input
// errors => any errors from Yup validation
// touched => when an input has be entered and moved away from by user
// status => when chagne from API has updated via setStatus
const UserForm = ({ values, errors, touched, status }) => {
    // console.log("values", values);
    // console.log("errors", errors);
    // console.log("touched", touched);
  
    // local state that holds successful form submission data
    const [user, setUser] = useState([]);
  
    // listens for status changes to update animals state
    useEffect(() => {
      console.log("status has changed!", status);
      // if status has content (an obj from API response) then render function setAnimals
      // use a spread to create a new array with all of animals' previous values + the new obj from the API stored in status
      // could be setAnimals([...animals, status]) but that fires a warning that we should watch animals. We don't need to watch for animals changes (this is the only place it could change)
      // change to animals => [...animals, status] to read in the current value of animals, and then use it to create a new array
      status && setUser(users => [...users, status]);
    }, [status]);
    return (
      <div className="animal-form">
        {/* Form automagically applies handleSubmit from withFormik options declared below*/}
        <Form>
          {/* can wrap Field with label to apply label. Need id on Field to create association*/}
          <label htmlFor="name">
            Name
            {/* name is the key within values (the current state of the form inputs) */}
            <Field
              id="name"
              type="text"
              name="name"
              placeholder="name"
            />
            {/* touched is if input has been visited, errors are captured from Yup validation. 
            If has been visited && errors exist for that input => render JSX to show errors*/}
            {touched.name && errors.name && (
              <p className="errors">{errors.name}</p>
            )}
          </label>
          <label htmlFor="password">
            Password
            <Field id="password" type="text" name="password" placeholder="password" />
            {touched.password && errors.password && (
              <p className="errors">{errors.password}</p>
            )}
          </label>
          <label htmlFor="email">
            E-Mail
            <Field id="email" type="text" name="email" placeholder="e-mail" />
            {touched.email && errors.email && (
              <p className="errors">{errors.email}</p>
            )}
          </label>
          {/* For Fields that use input elements other thank <input /> use as to declare what HTML input to use for Field*/}
         
          <label className="checkbox-container">
            Terms of Service
            <Field
              type="checkbox"
              name="tos"
              checked={values.tos}
            />
            <span className="checkmark" />
          </label>
          
          <button type="submit">Submit!</button>
        </Form>
        {/* <pre>{JSON.stringify(values, null, 2)}</pre>
        <pre>{JSON.stringify(errors, null, 2)}</pre> */}
         {user.map(info => {
          return (
            <ul key={user.id}>
            <li>Name: {info.name}</li>
            <li>Password: {info.password}</li>
            <li>email: {info.email}</li>
          </ul>
            
          );
         })}
         
      </div>
    );
  };
  
  const FormikUserForm = withFormik({
    // props from <AnimalForm /> in app are in props param
    mapPropsToValues(props) {
      // set initial state of form to value from parent component OR the initial value (after || )
      return {
        name: props.name || "",
        password: props.password || "",
        email: props.email || "",
        tos: props.tos || false,
        
      };
    },
  
    // Declare shape and requirement of values object (form state )
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Please enter your name"),
      // passing a string in required makes a custom inline error msg
      password: Yup.string().required("Please enter your password"),
      email: Yup.string().required("Email is required")
      
      
    }),
  
    // passed through props (magically) to Form component in Formik
    // fires when button type=submit is fired
    // values = state of form, formikBag is second param
    // in FormikBag: setStatus (sends API response to AnimalForm) & resetForm (clears form when called)
    handleSubmit(values, { setStatus, resetForm }) {
      console.log("submitting", values);
    
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          console.log("successfully posted", res);
          // sends a status update through props in AnimalForm with value as res.data content
          setStatus(res.data);
        
  
          //clears form inputs, from FormikBag
          resetForm();
        })
        .catch(err => console.log(err.response));
    }
  })(UserForm);
  
  

export default FormikUserForm;