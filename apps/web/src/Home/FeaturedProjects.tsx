const FeaturedProjects = ({ projects }: { projects: any }) => {
  if (projects.length > 0) {
    console.log(projects);
  }
  return (
    <div>
      {projects.map((project: any) => {
        return (
          <div key={project.id}>
            <h2>{project.title}</h2>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProjects;
