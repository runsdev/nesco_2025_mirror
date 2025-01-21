type RenderIfProps = {
  when: boolean;
  children?: React.ReactNode;
};

export default function RenderIf({ when = false, children }: RenderIfProps) {
  return <>{when ? children : null}</>;
}
