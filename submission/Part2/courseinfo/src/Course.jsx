const Header = (props) => {
    return (
        <>
            <h2>{props.header}</h2>
        </>
    )
}

const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Content = ({ parts }) => {
    return (
        <>
            {parts.map(part => (
                <Part key={part.id} part={part} />
            ))}
        </>
    )
}

const Total = ({ parts }) => {
    const total = parts.map((part => part.exercises)).reduce((a, b) => a + b);
    return (
        <b>Total exercises {total}</b>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header header={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course