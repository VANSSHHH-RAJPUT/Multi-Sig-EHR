const trustDoctor = async () => {
  if (!doctorToTrust) {
    toast.warning("Enter a doctor address.");
    return;
  }

  if (!contract || !account) {
    toast.error("Wallet or contract not ready.");
    return;
  }

  try {
    // Check if caller is a registered patient
    const patient = await contract.methods.patients(account).call();
    if (!patient.isRegistered) {
      toast.error("Only registered patients can trust doctors.");
      return;
    }

    // Check if the entered address is a registered doctor
    const doc = await contract.methods.doctors(doctorToTrust).call();
    if (!doc.isRegistered) {
      toast.error("That address is not a registered doctor.");
      return;
    }

    // Trust the doctor
    await contract.methods.addTrustedDoctor(doctorToTrust).send({ from: account });
    toast.success("✅ Doctor trusted successfully!");
    setDoctorToTrust("");
  } catch (error) {
    console.error("Trust doctor error:", error);
    toast.error("❌ Could not trust doctor. Check console.");
  }
};
