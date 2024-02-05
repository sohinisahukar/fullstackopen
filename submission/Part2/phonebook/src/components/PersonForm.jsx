import React from "react";

const PersonForm = (props) => {
    return(
        <form onSubmit={props.addPerson}>
        <div>
          name: <input required value={props.newName}
                  onChange={props.handleAddName}
                />
        </div>
        <div>
          number: <input required value={props.newNumber}
                    onChange={props.handleAddNumber}
                  />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm