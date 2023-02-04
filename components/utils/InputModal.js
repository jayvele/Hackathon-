import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.scss';

export default function InputModal({
  fields,
  students,
  type,
  state,
  user,
  handleSubmit,
  title,
  closeModal,
}) {
  const [show, setShow] = useState(state);
  const [data, setData] = useState(() => {
    let obj = {};
    fields.map((e) => (obj[e.name] = ''));
    return obj;
  });

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setData(() => {
      let obj = {};
      fields.map((e) => (obj[e.name] = ''));
      return obj;
    });
    setselected([]);
    closeModal();
  };

  const handleChange = (e) => {
    const inp = e.target.getAttribute('inp');
    setData((prev) => {
      return { ...prev, [inp]: e.target.value };
    });
  };

  const handleSubmitForm = () => {
    setShow(false);
    setData(() => {
      let obj = {};
      fields.map((e) => (obj[e.name] = ''));
      return obj;
    });
    setselected([]);
    closeModal();
    handleSubmit({ ...data, selectedStudents: selected || [] });
  };

  useEffect(() => {
    if (state == show) return;
    setShow(state);
  }, [state]);

  const [options, setoptions] = useState(students);
  const [selected, setselected] = useState([]);
  const [loading, setloading] = useState(false);
  const onSelect = (list, item) => {
    setselected([...list]);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <div className={styles.modal}>
          <Modal.Header closeButton>
            <Modal.Title>{title || 'Modal'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {fields.map((e, i) => (
                <Form.Group
                  key={i}
                  className="mb-3"
                  controlId={
                    e.textarea
                      ? 'exampleForm.ControlTextarea1'
                      : 'exampleForm.ControlInput1'
                  }
                >
                  <Form.Label>{e.label}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={e.placeholder || ''}
                    inp={e.name}
                    onChange={handleChange}
                    value={data[e.name]}
                    autoComplete={'off'}
                    auto
                    as={e.textarea ? 'textarea' : 'input'}
                    rows={e.textarea ? 3 : ''}
                  />
                </Form.Group>
              ))}
            </Form>
            {type == 'dashboard' && user.usertype === 'teacher' ? (
              <div className="py-2 pb-4">
                <Multiselect
                  placeholder="Add students"
                  loading={loading}
                  options={options}
                  selectedValues={selected}
                  onSelect={onSelect}
                  onRemove={onSelect}
                  displayValue="name"
                />
              </div>
            ) : (
              ''
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmitForm}>
              Save Changes
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
