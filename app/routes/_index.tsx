import type { MetaFunction } from "@remix-run/node";
import styled from "styled-components";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix with Styled Components" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Container = styled.div`
  background-color: #3e3e3e;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  h1{
    margin: 0px;
    font-size: 46px;
    max-width: 500px;
    padding: 24px;
    color: white;
  }
`;

export default function Index() {
  return (
    <Container>
      <h1>Remix is running with Styled Components</h1>
    </Container>
  );
}