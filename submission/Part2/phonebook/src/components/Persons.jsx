import React from "react";

const Persons = (props) => {
    return(
        <>
        {props.persons.map(person =>
            <p>{person.name} {person.number}</p>
          )}
        </>
    )
}

export default Persons