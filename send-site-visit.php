<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

// PHPMailer files
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

// ==========================================
// CONFIGURATION
// ==========================================

// Your Hostinger email
$smtpUsername = 'YOUR_EMAIL@YOURDOMAIN.COM';

// Your Hostinger email password
$smtpPassword = 'YOUR_EMAIL_PASSWORD';

// Admin email where leads should arrive
$adminEmail = 'YOUR_ADMIN_EMAIL@YOURDOMAIN.COM';


// ==========================================
// ONLY POST REQUEST
// ==========================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);

    exit;
}


// ==========================================
// GET FORM DATA
// ==========================================

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');


// ==========================================
// VALIDATION
// ==========================================

if ($name === '' || $phone === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter your name and phone number.'
    ]);

    exit;
}


// Name validation
if (!preg_match("/^[a-zA-Z\s.'-]{2,100}$/", $name)) {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid name.'
    ]);

    exit;
}


// Phone validation
if (!preg_match("/^[0-9+\-\s()]{7,20}$/", $phone)) {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid phone number.'
    ]);

    exit;
}


// ==========================================
// CREATE MAIL
// ==========================================

$mail = new PHPMailer(true);

try {

    // ======================================
    // SMTP SETTINGS
    // ======================================

    $mail->isSMTP();

    $mail->Host = 'smtp.hostinger.com';

    $mail->SMTPAuth = true;

    $mail->Username = $smtpUsername;

    $mail->Password = $smtpPassword;

    // Secure SMTP
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

    // Hostinger SMTP SSL port
    $mail->Port = 465;


    // ======================================
    // SENDER
    // ======================================

    $mail->setFrom(
        $smtpUsername,
        'Website Site Visit'
    );


    // ======================================
    // ADMIN RECEIVER
    // ======================================

    $mail->addAddress(
        $adminEmail,
        'Admin'
    );


    // ======================================
    // EMAIL CONTENT
    // ======================================

    $mail->isHTML(true);

    $mail->Subject = 'New Site Visit Request';


    $safeName = htmlspecialchars(
        $name,
        ENT_QUOTES,
        'UTF-8'
    );

    $safePhone = htmlspecialchars(
        $phone,
        ENT_QUOTES,
        'UTF-8'
    );


    $mail->Body = "
    
    <div style='font-family:Arial,sans-serif;background:#f5f7fb;padding:30px;'>

        <div style='max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;'>

            <h2 style='color:#155DFC;margin-top:0;'>
                New Site Visit Request
            </h2>

            <p style='color:#475569;'>
                A new visitor has requested a free site visit.
            </p>

            <table width='100%' cellpadding='12' cellspacing='0'
                style='border-collapse:collapse;margin-top:20px;'>

                <tr>
                    <td style='font-weight:bold;border-bottom:1px solid #e5e7eb;'>
                        Name
                    </td>

                    <td style='border-bottom:1px solid #e5e7eb;'>
                        {$safeName}
                    </td>
                </tr>

                <tr>
                    <td style='font-weight:bold;border-bottom:1px solid #e5e7eb;'>
                        Phone
                    </td>

                    <td style='border-bottom:1px solid #e5e7eb;'>
                        {$safePhone}
                    </td>
                </tr>

                <tr>
                    <td style='font-weight:bold;'>
                        Submitted
                    </td>

                    <td>
                        " . date('d M Y, h:i A') . "
                    </td>
                </tr>

            </table>

            <div style='margin-top:25px;padding:15px;background:#eff6ff;border-radius:8px;'>

                <strong>Action Required:</strong><br>

                Please contact the customer for the requested site visit.

            </div>

        </div>

    </div>

    ";


    // Plain text fallback
    $mail->AltBody =
        "New Site Visit Request\n\n" .
        "Name: {$name}\n" .
        "Phone: {$phone}\n" .
        "Submitted: " . date('d M Y, h:i A');


    // ======================================
    // SEND
    // ======================================

    $mail->send();


    echo json_encode([
        'success' => true,
        'message' => 'Your site visit request has been submitted successfully.'
    ]);

} catch (Exception $e) {

    // IMPORTANT:
    // Don't expose SMTP credentials/errors to visitors.

    error_log(
        'Site Visit Email Error: ' . $mail->ErrorInfo
    );

    echo json_encode([
        'success' => false,
        'message' => 'Unable to submit your request right now. Please try again.'
    ]);
}

exit;
?>