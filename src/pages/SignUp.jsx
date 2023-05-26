import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [nicknameErrorMessage, setNicknameErrorMessage]= useState('');
    const [emailAvailability, setEmailAvailability] = useState('');

    const checkEmailExistence = async (email) => {
        try {
           // 가상의 서버 주소를 사용하여 GET 요청을 보냅니다.
           const response = await axios.get(`/api/members/signup/checkEmail?email=${email}`);

           // 서버에서 중복 여부를 응답받습니다.
           const exists = response.data;
           return exists;
       } catch (error) {
           console.error(error);
           return false;
       }
   };
    const checkNicknameExistence = async (nickname) => {
        try {
            // 가상의 서버 주소를 사용하여 GET 요청을 보냅니다.
            const response = await axios.get(`/api/members/signup/checkNickname?nickname=${nickname}`);

            // 서버에서 중복 여부를 응답받습니다.
            const exists = response.data;
            return exists;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const validateEmail = (email) => {
        // 이메일 유효성 검사를 수행합니다.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // 비밀번호 유효성 검사를 수행합니다.
        // 예시: 비밀번호는 숫자와 영문자를 포함한 8글자 이상이어야 함
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
        return passwordRegex.test(password);
    };

    const emailChangeHandler = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setEmailErrorMessage('');

        if (!validateEmail(newEmail)) {
            setEmailErrorMessage('유효한 이메일 주소를 입력해주세요.');
        } else {
            // 이메일 중복 체크
            checkEmailExistence(newEmail).then((exists) => {
                if (exists) {
                    setEmailErrorMessage('이미 가입된 이메일입니다.');
                }
            });
        }
    };

    const passwordChangeHandler = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordErrorMessage('');

        if (!validatePassword(newPassword)) {
            setPasswordErrorMessage('비밀번호는 숫자, 영문자, 특수문자를 포함한 8글자 이상이어야 합니다.');
        }
    };

    const confirmPasswordChangeHandler = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setConfirmPasswordErrorMessage('');

        if (newConfirmPassword !== password) {
            setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
        }
    };

    const nicknameChangeHandler = (e) => {
        const newNickname = e.target.value;
        setNickname(newNickname);
        setNicknameErrorMessage('');

        // 닉네임 중복 체크
        checkNicknameExistence(newNickname).then((exists) => {
            if (exists) {
                setNicknameErrorMessage('이미 사용 중인 닉네임입니다.');
            }
        });
    };

    const isAgreedChangeHandler = (e) => {
        setIsAgreed(e.target.checked);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        // 약관 동의 여부 확인
        if (!isAgreed) {
            alert('약관에 동의해야 합니다.');
            return;
        }

        //
        // 이메일 중복 체크
        checkEmailExistence(email).then((exists) => {
            if (exists) {
                setEmailErrorMessage('이미 가입된 이메일입니다.');
                return;
            }

            // 비밀번호 유효성 검사
            if (!validatePassword(password)) {
                setPasswordErrorMessage('비밀번호는 최소 8자 이상이어야 합니다.');
                return;
            }

            // 비밀번호 확인
            if (confirmPassword !== password) {
                setConfirmPasswordErrorMessage('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 회원가입 로직 처리
            // ...

            // 폼 제출 후 필드 초기화
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setNickname('');
            setIsAgreed(false);
        });
    };

    return (
        <>
            <form onSubmit={submitHandler}>
                <div>
                    <label>이메일</label>
                </div>
                <div>    
                    <input
                        type="email"
                        value={email}
                        onChange={emailChangeHandler}
                        placeholder="이메일"
                        required
                    />
                    <button type="button" onClick={() => checkEmailExistence(email)}>
                        중복체크
                    </button>
                </div>
                {emailErrorMessage && <span>{emailErrorMessage}</span>}
                {emailAvailability && <span>{emailAvailability}</span>}
                <div>
                    <label>비밀번호</label>
                </div>
                <div>   
                    <input
                        type="password"
                        value={password}
                        onChange={passwordChangeHandler}
                        placeholder="비밀번호"
                        required
                    />
                </div>
                {passwordErrorMessage && <span>{passwordErrorMessage}</span>}

                <div>
                    <label>비밀번호 확인</label>
                </div>
                <div>   
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        placeholder="비밀번호 재입력"
                        required
                    />
                </div>
                {confirmPasswordErrorMessage && <span>{confirmPasswordErrorMessage}</span>}

                <div>
                    <label>닉네임</label>
                </div>
                <div>       
                    <input
                        type="text"
                        value={nickname}
                        onChange={nicknameChangeHandler}
                        placeholder="닉네임"
                        required
                    />
                    <button type="button" onClick={() => checkNicknameExistence(email)}>
                        중복체크
                    </button>
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={isAgreedChangeHandler}
                        required
                    />
                    <label>전체동의<br/>회원 서비스(필수), 위치 기반 정보 제공 동의(필수), 만 14세 이상(필수)</label>
                </div>
                <button type="submit">회원가입</button>
            </form>
        </>
    );
}

export default SignUp;


