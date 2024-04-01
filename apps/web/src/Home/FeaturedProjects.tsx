import FeaturedProject from "./FeaturedProject";

const FeaturedProjects = ({ projects }: { projects: any }) => {
  if (projects.length > 0) {
    console.log(projects);
  }
  return (
    <div>
      {projects.map((project: any) => {
        return <FeaturedProject key={project.id} project={project} />;
      })}
    </div>
  );
};

export default FeaturedProjects;
