import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Row, TimePicker } from "antd";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,

          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}{" "}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">

          <Col span={8} sm={24} xs={24} lg={8}>
              <img src="data:image/png;base64,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"
              
                width='100%'
                height='250'

              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timing : </b>
                {doctor.timings[0]} - {doctor.timings[1]}{" "}
              </h1>

              <p>
                {" "}
                <b>Phone Number : </b>
                {doctor.phoneNumber}{" "}
              </p>
              <p>
                <b>Address :</b> {doctor.address}
              </p>
              <p>
                <b>Fee per Visit :</b> {doctor.feePerConsultation}
              </p>

              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />

                <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
            
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
