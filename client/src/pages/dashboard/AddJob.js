import { FormRow, Alert, FormRowSelect } from "../../components"
import { useAppContext } from "../../context/appContext"
import Wrapper from "../../assets/wrappers/DashboardFormPage"
const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext()


  const handleSubmit = (e) => {
    e.preventDefault()//mni kandirha la page ne s acctualise pas
    
    if(!position || !company || !jobLocation){
      displayAlert()
      return
    }
     
    if(isEditing){
      editJob()
      return
    }
  createJob() 
  }
  const handleJobInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    handleChange({ name, value })
  }


  return <Wrapper>
    <form className="form">
      <h3>{isEditing ? 'edit job' : 'add job'}</h3>
      {showAlert && <Alert />}
      <div className="form-center">
        {/* position */}
        <FormRow
          type="text"
          name="position"
          value={position}
          handleChange={handleJobInput} />
        {/* company */}
        <FormRow
          type="text"
          name="company"
          value={company}
          handleChange={handleJobInput} />
        {/* location */}
        <FormRow
          type="text"
          labelText='job location'
          name="jobLocation"
          value={jobLocation}
          handleChange={handleJobInput} />
        {/* job status */}
        <FormRowSelect value={status}
          name='status'
          handleChange={handleJobInput}
          list={statusOptions} />
        {/* job type */}
        <FormRowSelect value={jobType}
          name='jobType'
          labelText='job type'
          handleChange={handleJobInput}
          list={jobTypeOptions} />
        {/* btn container */}
        <div className="btn-container">
          <button type="submit"
            className="btn btn-block submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            submit
          </button>
          <button type="submit" className="btn btn-block clear-btn" onClick={(e) => {
            e.preventDefault()
            clearValues()
            console.log('hello')
          }}>
            clear
          </button>
        </div>


      </div>
    </form>
  </Wrapper>
}
export default AddJob