import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { IoMdAddCircleOutline, IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline, IoMdDownload } from "react-icons/io";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { generatePDF } from "../../utils/GeneratePDF";
import './AddToDictionary.css';


const SinhalaDictionary = () => {
  const [words, setWords] = useState([]);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showEditWordModal, setShowEditWordModal] = useState(false);
  const [newWord, setNewWord] = useState({ sinhalaWord: "", englishWords: ["", "", ""] });
  const [editWord, setEditWord] = useState({ id: "", sinhalaWord: "", englishWords: ["", "", ""] });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [hover, setHover] = useState(false);
  const [acceptedWords, setAcceptedWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWords();
    fetchAcceptedWords();
  }, []);

  // Function to fetch accepted words
  const fetchAcceptedWords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sinhala-dictionary/accepted');
      setAcceptedWords(response.data);
    } catch (error) {
      console.error("Error fetching accepted words:", error);
    }
  };

  const prepareAcceptedWordsPDFData = (words) => {
    const title = "Accepted Words Report";
    const columns = ["Sinhala Word", "English Word 1", "English Word 2", "English Word 3"];
    const data = words.map(word => {
      const acceptedEnglishWords = word.englishWords.map((englishWord, index) => (
        word.status[index] === "accepted" ? englishWord : ""
      ));
      return {
        "Sinhala Word": word.sinhalaWord,
        "English Word 1": acceptedEnglishWords[0] || '',
        "English Word 2": acceptedEnglishWords[1] || '',
        "English Word 3": acceptedEnglishWords[2] || ''
      };
    });
    const fileName = "accepted_words_report";
    return { title, columns, data, fileName };
  };  
  
  const downloadAcceptedWordsPDF = () => {
    const { title, columns, data, fileName } = prepareAcceptedWordsPDFData(acceptedWords);
    generatePDF(title, columns, data, fileName);
  };  
  
  const fetchWords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sinhala-dictionary/getWords');
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    try {
      const response = await axios.get('http://localhost:5000/api/sinhala-dictionary/search', {
        params: { query }
      });
      setWords(response.data);
    } catch (error) {
      console.error('Error searching words:', error);
    }
  };

  const handleAccept = async (id, index) => {
    try {
      await axios.patch(`http://localhost:5000/api/sinhala-dictionary/acceptWord/${id}/${index}`);
      setWords(prevWords =>
        prevWords.map(word =>
          word._id === id
            ? {
                ...word,
                status: word.status.map((status, i) => (i === index ? "accepted" : status))
              }
            : word
        )
      );
    } catch (error) {
      console.error("Error accepting word:", error);
    }
  };

  const handleReject = async (id, index) => {
    try {
      await axios.patch(`http://localhost:5000/api/sinhala-dictionary/rejectWord/${id}/${index}`);
      
      setWords(prevWords => {
        const updatedWords = prevWords.map(word => {
          if (word._id === id) {
            const updatedEnglishWords = word.englishWords.filter((_, i) => i !== index);
            const updatedStatus = word.status.filter((_, i) => i !== index);
  
            // Check if all English words are rejected and delete the Sinhala word
            if (updatedEnglishWords.length === 0) {
              handleDelete(id);
            }
  
            return {
              ...word,
              englishWords: updatedEnglishWords,
              status: updatedStatus,
            };
          }
          return word;
        });
        return updatedWords;
      });
  
    } catch (error) {
      console.error("Error rejecting word:", error);
    }
  };  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sinhala-dictionary/deleteWord/${id}`);
      setWords(prevWords => prevWords.filter(word => word._id !== id));
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const handleShowAddWordModal = () => setShowAddWordModal(true);

  const handleShowEditWordModal = (word) => {
    navigate(`/editDictionary/${word._id}`);
  };
  
  /*const handleEnglishWordChange = (wordType, index, value) => {
    if (wordType === 'editWord') {
      setEditWord(prevState => {
        const updatedEnglishWords = [...prevState.englishWords];
        updatedEnglishWords[index] = value;
        return {
          ...prevState,
          englishWords: updatedEnglishWords
        };
      });
    }
  };*/
  
  const validateForm = (data) => {
    const errors = {};
    if (!data.sinhalaWord.trim()) errors.sinhalaWord = "Sinhala word is required";
    if (!data.englishWords[0].trim()) errors.englishWords = "At least one English word is required";
    return errors;
  };

  return (
    <div className="container mt-5" style={{ paddingLeft: "0px" }}>
      <h1 className="mb-5 text-center" style={{color:'darkcyan'}}>Sinhala Dictionary Words</h1>

      <div className="d-flex justify-content-between align-items-center mb-4" style={{display:'flex'}}>
        <Link to="/AddToDictionary">
          <Button variant="primary" onClick={handleShowAddWordModal} style={{width:'500px', marginRight:'100px'}}>
            <IoMdAddCircleOutline className="mb-1" /> Add Word
          </Button>
        </Link>
          <Button
            className="btn-danger"
            onClick={downloadAcceptedWordsPDF}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              backgroundColor: hover ? '#3ca341' : 'green',
              borderColor: hover ? '#3ca341' : 'green'
            }}
          >
            <IoMdDownload className="mb-1" /> <span>Download Accepted Words</span>
          </Button>
      </div><br/>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ width: '800px' }}>
      {/* Search bar */}
      <Form.Control
          type="text"
          placeholder="Search by Sinhala word, English word, Status"
          value={searchQuery}
          onChange={handleSearch}
          style={{marginTop:'-100px'}}
        />
      </div>
      <br />

      <Table bordered hover className="table-bordered" style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", overflow: "hidden", border: "2px solid black", width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr align="center" style={{ backgroundColor: "#007bff", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>
            <th style={{ padding: "5px", width: "15%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Sinhala Word</th>
            <th style={{ padding: "10px", width: "10%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Edit/Delete</th>
            <th style={{ padding: "5px", width: "15%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>English Word 1</th>
            <th style={{ padding: "6px", width: "10%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Status</th>
            <th style={{ padding: "1px", width: "10%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Action</th>
            <th style={{ padding: "5px", width: "15%" , color: "white", fontSize: "13px", backgroundColor:'darkcyan'}}>English Word 2</th>
            <th style={{ padding: "6px", width: "10%" , color: "white", fontSize: "13px", backgroundColor:'darkcyan'}}>Status</th>
            <th style={{ padding: "1px", width: "10%" , color: "white", fontSize: "13px", backgroundColor:'darkcyan'}}>Action</th>
            <th style={{ padding: "5px", width: "15.5%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>English Word 3</th>
            <th style={{ padding: "6px", width: "10%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Status</th>
            <th style={{ padding: "1px", width: "10%", color: "white", fontSize: "13px", backgroundColor:'darkcyan' }}>Action</th>
          </tr>
        </thead>
        <tbody align="center" style={{ backgroundColor: "#e9ecef", fontSize: "12px" }}>
          {words.map(word => (
            <tr key={word._id}>
              <td style={{ padding: "5px", verticalAlign: "middle" }}>{word.sinhalaWord}</td>
              <td style={{ padding: '0px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant="warning" onClick={() => handleShowEditWordModal(word)}
                    style={{ backgroundColor: '#f0ad4e', borderColor: '#eea236', marginRight: '2px' }}>
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(word._id)}
                    style={{ backgroundColor: '#d9534f', borderColor: '#d43f3a' }}
                  >
                    <FaTrash style={{ marginLeft: '0px' }} />
                  </Button>
                  {/*<Button
                    variant="success"
                    onClick={() => handleDelete(word._id)}
                    style={{ backgroundColor: '#d9534f', borderColor: '#d43f3a' }}
                  >
                    <FaTrash style={{ marginRight: '0px' }} />
                  </Button>*/}
                </div>
              </td>
              {(word.englishWords || []).map((englishWord, index) => (
                <React.Fragment key={index}>
                  <td style={{ padding: "5px", verticalAlign: "middle" }}>{englishWord || ''}</td>
                  <td style={{ padding: "5px", verticalAlign: "middle" }}>{word.status[index] || ''}</td>
                  <td style={{ padding: "0px", verticalAlign: "middle" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {word.status[index] !== "accepted" && word.status[index] !== "" && (
                        <>
                          <Button variant="success" onClick={() => handleAccept(word._id, index)} style={{ marginRight: '2px', backgroundColor: '#28a745', color: '#fff', border: 'none' }}>
                            <IoMdCheckmarkCircleOutline />
                          </Button>
                          <Button variant="danger" onClick={() => handleReject(word._id, index)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none' }}>
                            <IoMdCloseCircleOutline />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Word Moda
      <Modal show={showEditWordModal} onHide={handleCloseEditWordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Word</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleEditWord}>
          <Form.Group className="mb-3" controlId="sinhalaWord">
            <Form.Label>Sinhala Word</Form.Label>
            <Form.Control
              type="text"
              value={editWord.sinhalaWord}
              onChange={(e) => setEditWord(prevState => ({ ...prevState, sinhalaWord: e.target.value }))}
              required
              isInvalid={!!errors.sinhalaWord}
            />
            <Form.Control.Feedback type="invalid">
              {errors.sinhalaWord}
            </Form.Control.Feedback>
          </Form.Group>

          {editWord.englishWords.map((englishWord, index) => (
            <Form.Group className="mb-3" controlId={`englishWord${index}`} key={index}>
              <Form.Label>English Word {index + 1}</Form.Label>
              <Form.Control
                type="text"
                value={englishWord}
                onChange={(e) => handleEnglishWordChange('editWord', index, e.target.value)}
                required={index === 0}
                isInvalid={index === 0 && !!errors.englishWords}
              />
              {index === 0 && (
                <Form.Control.Feedback type="invalid">
                  {errors.englishWords}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          ))}

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleCloseEditWordModal}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>*/}
    </div>
  );
};

export default SinhalaDictionary;