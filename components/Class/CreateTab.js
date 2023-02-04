import React from 'react';
import { Container } from '../../components';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
const CreateTab = ({ classdata }) => {
  return (
    <>
      <Container styles={'w-1 shadow-md mt-2 '}>
        <div className="p-2 text flex flex-column">
          <Link href={`\quiz\\${classdata.cid}`}>
            <Button variant="info">Create Quiz</Button>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default CreateTab;
